import { fetchProblemData, saveToS3 } from '../utils/aws.js';
import { prismaClient  } from "../db/index.js";



export async function createaProblem(req,res) {
    const userId=req.userId || 1;




    try {
        const user=await prismaClient.user.findUnique({
            where :{id:parseInt(userId)},
        })

        if(user.role!="problem_setter" &&  user.role!="admin"){
            return res.status(402).json({
                error:"unauthorized"
            })
        }

        const {title,problem_statement,difficulty="Easy",score=100,contestId,testCases,inputFormat,outputFormat,description,constraints}=req.body;

        // await saveToS3(`problems/${title}`,'/statement',problem_statement);  //  change in plan

        testCases.map(async(testCase,index)=>{
            await saveToS3(`problems/${title}/testcases/tc${index}`,`/input.txt`,testCase.input);
            await saveToS3(`problems/${title}/testcases/tc${index}`,`/check_output.txt`,testCase.output);
            // console.log(index);
            
        })

        // console.log(s3Obj);
        //  s3 folder url left here

        
        const problem=await prismaClient.problem.create({
            data:{
                title,author:userId,difficulty,score:parseInt(score),
                contestId:parseInt(contestId),
                testcaseCount:testCases.length,
                inputDescription:inputFormat,outputDescription:outputFormat
                ,description,constraints,
            }
        });

        return res.status(200).json({
            data:{
                problem
            }
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error:"internal server error"
        })
        
    }


    
}


export async function getProblem(req,res) {
    const userId=req.userId;

    try {
        

        const problemId=req.params.id;
        // console.log(problemId);
        


        const problem=await prismaClient.problem.findUnique({
            where:{id:parseInt(problemId)}
        });


        // console.log(s3Obj);
        
        

        return res.status(200).json({
            data:{
                problem,
                // s3Obj
            }
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error:"internal server error"
        })
        
    }
}


export const getProblems = async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const cnt = parseInt(req.query.cnt || 10);

  try {

    // only problems of contests that have ended 
    const userId=parseInt(req.id) || 0;

    const user =await prismaClient.user.findUnique({
      where: { id: parseInt(userId) },  
        select: {
            solvedProblems: {
            select: {
                id: true,
            },
            },
        },      
    });

    const problems = await prismaClient.problem.findMany({
      skip: (page - 1) * cnt,
      take: cnt,
      where:{
        OR:[
            {
                contest:{
                    startTime:{
                     lt:new Date(),
                  }
                }
            },
            {
                contestId:null
            }
        ],
        
      },
    });
    console.log(user);
    
    problems.forEach(problem =>{
        problem.isSolved = user?.solvedProblems.some(solvedProblem => solvedProblem.id === problem.id);
    }) ;
    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch contests' });
  }
};


export async function getProblemsofSetter(req,res) {
    let {userId}=req.userId
     try {
        if(!userId) userId=req.params.userId;
        const problems=await prismaClient.problem.findMany({
            where:{userId:parseInt(userId),contestId:null}
        });

        return res.status(200).json({
            data:{
                problems,
            }
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error:"internal server error"
        })
        
    }

}









export async function getProblemsofContest(req,res) {
    
     try {
        const {contestId}=req.params;
        const userId=parseInt(req.id);

        // console.log(contestId);
        

        
        const contest =await prismaClient.contest.findUnique({
            where:{id:parseInt(contestId)}
        });



        const problems=await prismaClient.problem.findMany({
            where:{contestId:parseInt(contestId)}
        });

        
         const date=new Date()

        if(contest.startTime>date.getTime()  && !contest.authorIds.has(userId) ){
            return res.status(500).json({
            error:"wait for contest to start"
        })
        }


        return res.status(200).json({
            data:{
                problems,
            }
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error:"internal server error"
        })
        
    }

}






