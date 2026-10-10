import express from 'express'
import { handleManagerSignUp } from '../controller/managerAuthentication.controller.js'



export const managerRouter = express.Router()


managerRouter.post('/register', handleManagerSignUp)