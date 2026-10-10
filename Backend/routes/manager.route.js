import express from 'express'
import { handleManagerSignUp, ManagerFireBaseAuthenticaton } from '../controller/managerAuthentication.controller.js'



export const managerRouter = express.Router()


managerRouter.post('/register', handleManagerSignUp)

managerRouter.post('/firebase-exchange', ManagerFireBaseAuthenticaton)