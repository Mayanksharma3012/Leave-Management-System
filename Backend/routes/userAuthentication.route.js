import express from 'express';
import { handleUserSignUp, handleUserLogin } from '../controller/userAuthentication.controller.js';
import { authenticateToken } from '../middlewares/userAuthentication.middleware.js';


export const userRouter = express.Router()

userRouter.post('/register', handleUserSignUp)
userRouter.post('/login', handleUserLogin)

userRouter.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});