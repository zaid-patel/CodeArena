import express from 'express';
import {
  checkProblemSetter,
  createContest,
  getContests,
  getContestsOfAuthor,
  addProblemToContest,
  addParticipantToContest,
  getRankingsOfContest,
  getContests2,
  getContestById,
} from '../controller/contest.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getProblemsofContest } from '../controller/problem.controller.js';
import { getContestSubmissions } from '../controller/submission.controller.js';

const router = express.Router();


router.use(authMiddleware);
router.post('/create', checkProblemSetter, createContest);
router.get('/', getContests);
router.get('/segregated', getContests2);

router.get('/author/:authorId', getContestsOfAuthor);
router.post('/add-problem', checkProblemSetter, addProblemToContest);
router.post('/add-participant/:contestId',addParticipantToContest);
router.get('/problems/:contestId',getProblemsofContest);
router.get('/:contestId',getContestById);


//  
router.get('/rankings/:contestId',getRankingsOfContest);
router.get('/submissions/:id', getContestSubmissions);



export default router;
