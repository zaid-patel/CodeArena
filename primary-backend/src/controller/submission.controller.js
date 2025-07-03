import { log } from "node:console";
import { prismaClient } from "../db/index.js";
import { fetchSubmission, saveToS3 } from "../utils/aws.js";
import { sendSubmission } from "../utils/producer.js";




export const addSubmission = async (req,res) => {
    try {
        const {problemId=1,code}=req.body;

        const userId=req.id;

        const problem=await prismaClient.problem.findFirst({where:{id:problemId}});

        if(!problem){
            return res.status(404).json("internal server error");
        }

        const contest=await prismaClient.contest.findUnique({where:{id:problem.contestId}});

        const time=new Date();
        
        const official=contest.participants?.find(userId) && contest.startTime <= now  && contest.endTime >= now;

        // console.log(official);
        
        
        let submission=await prismaClient.submission.create({
            data:{
               
                userId,
                verdict:"Pending",
                time,
                official,
                problemId,
            }
        });

        if(!submission) return res.status(200).json(submission);     
        const codeUrl= await saveToS3(`${userId}`,`/${submission.id}`,code);
        
        submission=await prismaClient.submission.update({
            where:{id:submission.id},
            data:{
               codeUrl,
               ...submission,
            }
        });

        // console.log("came herw");
        


        await sendSubmission("java-submissions",code,problemId,problem.title,problem.testcaseCount,submission.id,problem.checkerCode);
        return res.status(200).json(submission);             

    } catch (error) {
        console.log(error.message);
        return res.status(500).json("internal server error");
        
    }
}


export const checkStatus= async (req,res)=>{
    const {id}=req.params;
    try {

        log("checking status of submission",id);
        const submission=await prismaClient.submission.findFirst({
            where:{id:parseInt(id)},
        });

        if(!submission) return res.status(404).json("Submission not found");

        return res.status(200).json(submission.verdict);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("internal server error");
        
    }   
}


export const getContestSubmissions = async (req, res) => {
    const { id } = req.params;
    const userId=req.id;
    try {

        const contest=await prismaClient.contest.findFirst({
            where: { id: parseInt(id)},
            include:{problems:true} 
        })

        // console.log(userId);
        

        // const 
        const submissions = await prismaClient.submission.findMany({
            where: { 
                problemId: {
                    in: contest.problems.map(problem => problem.id)
                }
                
                ,userId:parseInt(userId) },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: { time: 'desc' },
        });

        return res.status(200).json(submissions);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("internal server error");
    }
}


export const getSubmissions = async (req, res) => {
    const userId=req.id;
    try {
        const submissions = await prismaClient.submission.findMany({
            where: { userId: parseInt(userId) },
            include: {
                problem: true,
                user: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: { time: 'desc' },
        });

        return res.status(200).json(submissions);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("internal server error");
    }
}


export const getSubmission= async (req, res) => {
    const { id } = req.params;
    try {
        const submission = await prismaClient.submission.findFirst({
            where: { id: parseInt(id) },
            include: {
                problem: true,
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });

      





        if (!submission) return res.status(404).json("Submission not found");

        console.log("aws call for submission retrival");
        
        submission.content=await fetchSubmission(submission.id,submission.userId)
        


        return res.status(200).json(submission);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("internal server error");
    }
}