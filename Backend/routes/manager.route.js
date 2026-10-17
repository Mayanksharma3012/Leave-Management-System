import express from 'express'
import { handleManagerLogin, handleManagerSignUp, ManagerFireBaseAuthenticaton } from '../controller/managerAuthentication.controller.js'
import { managerAuthenticateToken } from '../middlewares/userAuthentication.middleware.js'



export const managerRouter = express.Router()


managerRouter.post('/register', handleManagerSignUp)
managerRouter.post('/login', handleManagerLogin)

managerRouter.get('/me', managerAuthenticateToken, (req, res) => {
  res.json({ user: req.user });
});

managerRouter.post('/firebase-exchange', ManagerFireBaseAuthenticaton)