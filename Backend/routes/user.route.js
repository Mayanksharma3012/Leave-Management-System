import express from 'express';
import { handleUserSignUp, handleUserLogin, FireBaseAuthenticaton, handlePasswordChange } from '../controller/userAuthentication.controller.js';
import { authenticateToken } from '../middlewares/userAuthentication.middleware.js';
import { handleUserLeave, getUserLeaves } from '../controller/userLeave.controller.js';


export const userRouter = express.Router()

userRouter.post('/register', handleUserSignUp)
userRouter.post('/login', handleUserLogin)

userRouter.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});


userRouter.post('/applyleave', handleUserLeave)
userRouter.get('/getleaves', getUserLeaves)

// Logout route
userRouter.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,    // must match what you set during login
    path: '/',       // must match 
    // domain: '.yourdomain.com',  // add if you set domain on login
  });

  res.status(200).json({ message: 'Logged out' });
});   

userRouter.post('/firebase-exchange', FireBaseAuthenticaton)

userRouter.post('/change-password', handlePasswordChange)