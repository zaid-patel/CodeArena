import express from 'express';
import { addSubmission, checkStatus, getContestSubmissions,getSubmission,getSubmissions } from '../controller/submission.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


router.use(authMiddleware)
router.post('/add', addSubmission);
router.get('/status/:id', checkStatus);
router.get('/', getSubmissions);
router.get('/:id', getSubmission);






export default router;
