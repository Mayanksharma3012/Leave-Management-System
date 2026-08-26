import express from 'express';
import { handleUserSignUp } from '../controller/userAuthentication.controller.js';

export const userRouter = express.Router()

userRouter.post('/', handleUserSignUp)