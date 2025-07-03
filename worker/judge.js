import  { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import { Kafka } from 'kafkajs';
import { TOPIC_NAME }  from './config.js';
import { fetchS3Folder } from './aws.js';
import path from 'path';


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




const kafka=new Kafka({
    clientId:'java-worker-1',
    brokers: ['kafkazoo:9092']
})




async function main() {
    const consumer=kafka.consumer({
      groupId:"2",
    })

    const producer = kafka.producer();
    await producer.connect();


    await consumer.connect();


    await consumer.subscribe({
      topic: TOPIC_NAME,
      fromBeginning:true,
    })

    await consumer.run({
      autoCommit:true,   
      //  should we not auto commit?  is it safe? it can be that user wants to starve with some error throwing code
      eachMessage:  async ({topic,message}) =>{
          // console.log(message);

          if(!message.value?.toString()) return;

          const parsedMessage=JSON.parse(message.value?.toString());

          const {problemTitle,current,code,testcasecnt,checkerCode} =parsedMessage;
          // console.log(parsedMessage);

          // if(parsedMessage.code)



          fs.writeFileSync('Main.java',code.trim(),'utf-8');
          await fetchS3Folder(`problems/${problemTitle}/testcases/tc${current-1}`,path.join(__dirname,`/testcase`));



          // console.log("came here from  judge");
          let exitCode=0;
          
          try {
             try {
                 execSync('javac Main.java');
             } catch (e) {
             console.log('Compilation Error:');
             console.log(e.stderr?.toString() || e.message);
             exitCode =2; 
            }

          if (!fs.existsSync('Main.class')) {
              console.log('Compilation did not produce Main.class!');
              exitCode=2;
            }

          const runResult = spawnSync('java', ['-cp', '.', 'Main'], {
             input: fs.readFileSync(path.join(__dirname,'/testcase/input.txt')),
             timeout: 5000,
             encoding: 'utf-8',
            });

          if (runResult.error) {
               console.log('Runtime Error:', runResult.error);
               if(runResult.error.message.includes('ETIMEDOUT')) {
                exitCode=4; // Verdict 4 - Time Limit Exceeded
               }
               else if(runResult.error.message.includes('Memory')) {
                exitCode=5; // Verdict 5 - Memory Limit Exceeded
               }
               else
               exitCode=3; // Verdict 3 - Runtime Error
              }

          // if (runResult.status !== 0) {
          //   console.log('Runtime Error:');
          //   console.log(runResult.error.message , exitCode);
          //   // exitCode=3; // Runtime Error
          // }

          // Step 4: Save output to file

          if(exitCode==0){
                fs.writeFileSync('output.txt', runResult.stdout);


                 // Step 5: Compare with expected output

                 if(checkerCode?.length>0){
                    console.log("this is left");
                    
                 }
                 const actual = fs.readFileSync('output.txt', 'utf-8').trim();
                 const expected = fs.readFileSync(path.join(__dirname,'/testcase/check_output.txt'), 'utf-8').trim();
          

                  if (actual === expected) {
                    console.log('Accepted');
                    exitCode = 0 // Verdict 0 - Accepted
                  } else {
                      console.log('Wrong Answer');
                      console.log('Expected:\n' + expected);
                      console.log('Got:\n' + actual);
                      exitCode=-1; // Verdict -1 - Wrong Answer
                    }
            }
            if(exitCode==0){
              if(current==testcasecnt){
                console.log("solution accespted");
                sendToSubmissionQueue(parsedMessage,exitCode,producer);
              }
              else {

                 const payload = {
                    verdict:"Accepted",
                    statement:"Very smart",
                     problemId:1,
                     submissionId:5,
                     exitCode,}
                
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{ value: JSON.stringify(payload) }],
                 });

                 console.log("running on testcase:"+current);
                
              }
            }
            else {
              sendToSubmissionQueue(parsedMessage,exitCode,producer);
            }
            return process.exitCode=exitCode;
        
          } catch (err) {
            console.error('Unhandled Error:', err.message);
            exitCode=5; // Unexpected failure
          }
          fs.unlinkSync('Main.java');
          fs.unlinkSync('Main.class');
                  

          
      }


    })
}


async function sendToSubmissionQueue(parsedMessage,exitCode,producer) {
    const {problemId,submissionId}=parsedMessage;
    const payload = {
        statement:exitCode==0? "Very smart":"Try again",
        problemId,
        submissionId,
        exitCode,
    }

    await producer.send({
        topic: 'Submissions',
        messages: [{ value: JSON.stringify(payload) }],
     });

     console.log("sent to submission queue");
  
}

main();

