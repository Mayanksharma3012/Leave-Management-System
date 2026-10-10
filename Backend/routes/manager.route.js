import express from 'express'
import { handleManagerLogin, handleManagerSignUp, ManagerFireBaseAuthenticaton } from '../controller/managerAuthentication.controller.js'



export const managerRouter = express.Router()


managerRouter.post('/register', handleManagerSignUp)
managerRouter.post('/login', handleManagerLogin)


managerRouter.post('/firebase-exchange', ManagerFireBaseAuthenticaton)