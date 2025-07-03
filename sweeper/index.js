import { Kafka } from 'kafkajs';
import { PrismaClient } from '@prisma/client';


const prismaClient = new PrismaClient();


const kafka=new Kafka({
    clientId:'sweeper-1',
    brokers: ['localhost:9093'],
})

const  main=async ()=>{

    try {

        const consumer=kafka.consumer({
              groupId:"4",
            })
        
            const producer = kafka.producer();
            await producer.connect();
        
        
            await consumer.connect();
        
        
            await consumer.subscribe({
              topic: "Submissions",
              fromBeginning:true,
            })
        
            await consumer.run({
              autoCommit:true,   
              //  should we not auto commit?  is it safe? it can be that user wants to starve with some error throwing code
              eachMessage:  async ({topic,message}) =>{
                  // console.log(message);
        
                  if(!message.value?.toString()) return;
        
                  const parsedMessage=JSON.parse(message.value?.toString());
                    // console.log(parsedMessage);
                    const  {statement,problemId,submissionId,exitCode}=parsedMessage;
                    console.log(exitCode);
                    let verdict="Wrong_Answer";
                    if(exitCode==0){
                        verdict="Accepted";
                    }
                    else if(exitCode==1){
                        verdict="Compilation_Error";
                    }
                    else if(exitCode==2){
                        verdict="Runtime_Error";
                    }
                    else if(exitCode==4){
                        verdict="TLE";
                    }
                    else if(exitCode==5){
                        verdict="MLE";
                    }
                    // else if(exitCode==5){
                    //     verdict="Internal Error";
                    // }
                    const submission=await prismaClient.submission.findFirst({where:{id:submissionId}});
                    const problem=await prismaClient.problem.findFirst({where:{id:problemId}});
                    const contest=await prismaClient.contest.findFirst({where:{id:problem.contestId}});
                     await prismaClient.submission.update({
                         where:{id:submission.id},
                         data:{
                           ...submission,   
                             verdict,
                             statement,
                            }
                            });
        if(submission?.official){
            //  this requires ranking for each user to be defined at the time of registration for the contest
            const ranking=await prismaClient.ranking.findFirst({where:{userId:submission.userId,contestId:problem.contestId}});  // candidate key
                

            //  whereas this is different apparently  why?  because at the time of contest registration, for each problem creating a problemstat is not required for each user
            //        as he migh not solve all of them in most cases 
            let problemStat=await prismaClient.problemStat.findFirst({where:{rankingId:ranking.id,problemId:problemId}});  // candidate key
      
            if(!problemStat){  // first submission for the problem
                problemStat=await prismaClient.problemStat.create({
                    data:{
                        rankingId:ranking.id,
                        problemId:problemId,
                    }});  // candidate key
      
            }

            let score=problemStat.score;
            let timeTaken=0;
            let attempts=problemStat.attempts;
            let failedAttempts=ranking.failedAttempts;
            failedAttempts=exitCode!=0?failedAttempts+1:failedAttempts;
            let lastAttempted=ranking.lastAttempted;
            let finalTime=ranking.finalTime;
            let contestScore=ranking.score;
            

            if(!problemStat.solved && exitCode==0){
                 score=problem.score;
                 contestScore+=score;
                 timeTaken=submission.time-contest.startTime;
                 timeTaken=Date.parse(timeTaken)/1000;  // in seconds
                 attempts++;

                 if(submission.time>lastAttempted){
                    lastAttempted=submission.time;
                 }
                 if(finalTime<lastAttempted){
                    finalTime=lastAttempted;
                 }
                 

                
                }
                else if(exitCode!=0){
                    attempts++;
                    failedAttempts++;
                    finalTime+=5;  //  ??  penalising
                }
                
             [problemStat,ranking]= await prismaClient.$transaction([
                prismaClient.problemStat.update({
                    where:{id:problemStat.id},
                    data:{
                       attempts:attempts++,
                       solved:exitCode==0 || problemStat.solved,
                       timeTaken,
                       score,
                       attempts,

                    }}),
                prismaClient.ranking.update({
                    where:{id:ranking.id},
                    data:{
                        ...ranking,
                        finalTime,
                        lastAttempted,
                        failedAttempts,
                        score:contestScore,
                        

                    }

                })

             ]);
             

              
            console.log(ranking);
            console.log(problemStat);

        
           
        }

        console.log(submission);
        console.log("from sweeper");
        
        // console.log(pr);
        }

    })
    } catch (error) {
        console.log(error.message);
       
    }
};


main();