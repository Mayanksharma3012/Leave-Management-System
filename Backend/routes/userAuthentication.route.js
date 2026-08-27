import express from 'express';
import { handleUserSignUp, handleUserLogin } from '../controller/userAuthentication.controller.js';

export const userRouter = express.Router()

userRouter.post('/register', handleUserSignUp)
userRouter.post('/login', handleUserLogin)