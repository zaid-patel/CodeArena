import express from 'express';
import { createaProblem, getProblem, getProblems } from '../controller/problem.controller.js';

const problemsRouter = express.Router();

problemsRouter.post('/', createaProblem);
problemsRouter.get('/:id', getProblem);
problemsRouter.get('/', getProblems);

export  {problemsRouter};
