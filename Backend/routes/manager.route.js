import express from 'express'
import { handleManagerLogin, handleManagerSignUp, ManagerFireBaseAuthenticaton } from '../controller/managerAuthentication.controller.js'
import { managerAuthenticateToken } from '../middlewares/userAuthentication.middleware.js'
import { AvailableEmployees, ManagerEmployees, AddEmployee} from '../controller/manager.controller.js'
import { EmployeesLeavesRequests, reviewLeaveRequest } from '../controller/userLeave.controller.js'


export const managerRouter = express.Router()


managerRouter.post('/register', handleManagerSignUp)
managerRouter.post('/login', handleManagerLogin)

managerRouter.get('/me', managerAuthenticateToken, (req, res) => {
  res.json({ user: req.user });
});

managerRouter.post('/firebase-exchange', ManagerFireBaseAuthenticaton)


managerRouter.get('/availableemployee', AvailableEmployees)

managerRouter.get('/employees', managerAuthenticateToken, ManagerEmployees)

managerRouter.post('/addemployee', managerAuthenticateToken, AddEmployee)

managerRouter.get('/leaverequests', managerAuthenticateToken, EmployeesLeavesRequests)
managerRouter.patch('/leaverequests/:leaveId/review', managerAuthenticateToken, reviewLeaveRequest)