import { prismaClient } from "../db/index.js";

const checkProblemSetter = async (req, res, next) => {
  const user = await prismaClient.user.findUnique({
    where: { id: req.userId },
  });
  // console.log("checking");
  
  if (!user || user.role !== 'problem_setter') {
    return res.status(403).json({ message: 'Only problem setters can perform this action' });
  }

  next();
};

const createContest = async (req, res) => {
  const { startTime, endTime,title } = req.body;

  try {
    const contest = await prismaClient.contest.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        authorIds: [req.userId],
        title,
      },
    });
    res.status(201).json(contest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create contest' });
  }
};


const getContests = async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const cnt = parseInt(req.query.cnt || 10);

  try {
    const contests = await prismaClient.contest.findMany({
      skip: (page - 1) * cnt,
      take: cnt,
      orderBy: { startTime: 'desc' },
    });
    res.json(contests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch contests' });
  }
};



const getContestById = async (req, res) => {
  const contestId = parseInt(req.params.contestId);

  try {
    // console.log(contestId);
    
    const contest = await prismaClient.contest.findFirst({
      where: { id: contestId },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
          },
        },

      }
    });
    res.json(contest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch contests' });
  }
};


const getContests2 = async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const cnt = parseInt(req.query.cnt || 10);

  try {
    const upcomingContests = await prismaClient.contest.findMany({
      skip: (page - 1) * cnt,
      take: cnt,
      orderBy: { startTime: 'desc' },
      where:{
        startTime: {
          gte: new Date(), 
        },
      }
    });
    const pastContests = await prismaClient.contest.findMany({
      skip: (page - 1) * cnt,
      take: cnt,
      orderBy: { startTime: 'desc' },
      where:{
        startTime: {
          lt: new Date(), 
        },
      }
    });

    // console.log(upcomingContests);
    
    res.json({contests: upcomingContests, pastContests});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch contests' });
  }
};


const getContestsOfAuthor = async (req, res) => {
  const authorId = parseInt(req.params.authorId);

  try {
    const contests = await prismaClient.contest.findMany({
      where: {
        authorIds: {
          has: authorId, // Check if the authorId is in the authorIds array
        },
      },
    });
    res.json(contests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch author contests' });
  }
};

const addProblemToContest = async (req, res) => {
  const { contestId, problemId } = req.body;

  try {
    const problem = await prismaClient.problem.update({
      where: { id: problemId },
      data: {
        contestId: contestId,
      },
    });

    res.json({ message: 'Problem added to contest', problem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add problem to contest' });
  }
};




const addParticipantToContest = async (req, res) => {
  const contestId  = parseInt(req.params.contestId);
  const userId = req.id; 

  try {
    // console.log("from participant", contestId, userId);
    
    const [user, contest] = await Promise.all([
      prismaClient.user.findUnique({ where: { id: userId } }),
      prismaClient.contest.findUnique({ where: { id: contestId } }),
    ]);

    if (!user || user.role !== 'coder') {
      return res.status(403).json({ message: 'invalid role to join contests' });
    }

    if (!contest) {
      return res.status(404).json({ message: 'Contest not found' });
    }

    const now = new Date();
    if (contest.startTime <= now) {
      return res.status(400).json({ message: 'Cannot join a contest after it has started' });
    }

    await prismaClient.contest.update({
      where: { id: contestId },
      data: {
        participants: {
          connect: { id: userId },
        },
      },
    });

    res.json({ message: 'Successfully joined the contest' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to join contest' });
  }
};



const getRankingsOfContest = async (req,res) =>{
    try {
        const contestId =parseInt(req.params.contestId);

        const oage = parseInt(req.query.oage || 1);
        const cnt = parseInt(req.query.cnt || 10);


        const skip=(oage-1)*cnt;
        const contest = await prismaClient.contest.findUnique({
            where: { id: contestId },
            include:{
              problems:{
                select:{
                  id:true,
                  title:true,
                  score:true,
              },
              
            },
            participants:{
              select:{
                id:true,
            }} 
          }
        });

        // console.log(contestId);
        
        const ranking=await prismaClient.ranking.findMany({
            where:{
                contestId:contestId,
            },
            orderBy:[
                {score:"desc"},
                {finalTime:"asc"}
            ],
            skip,
            take:cnt,
            include:{
                user:{
                    select:{
                        username:true
                    }
                    
                },
                problemStats:{
                    select:{
                      problemId:true,
                      timeTaken:true,
                      solved:true,
                      score:true,
                      attempts:true,
                    }
                },
            }

        })
        if(!ranking)  return res.status(400).json({error:"no rankings for contest found"})


        return res.status(200).json({ranking,contest});

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:"internal server error"})
        
    }
}



export {
  checkProblemSetter,
  createContest,
  getContests,
  getContestsOfAuthor,
  addProblemToContest,
  addParticipantToContest,
  getRankingsOfContest,getContests2,
  getContestById,
};
