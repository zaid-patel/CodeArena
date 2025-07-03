import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  signInUser,
  signUpUser
} from '../controller/user.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();  

router.post('/signup', signUpUser);
router.post('/login', signInUser);
// router.post('/logout',authMiddleware, signOutUser);


router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
