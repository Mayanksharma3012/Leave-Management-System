import express from 'express';
import multer from 'multer';
import { handleUserSignUp, handleUserLogin, FireBaseAuthenticaton, handlePasswordChange } from '../controller/userAuthentication.controller.js';
import { userAuthenticateToken } from '../middlewares/userAuthentication.middleware.js';
import { handleUserLeave, getUserLeaves , editLeave, deleteLeave} from '../controller/userLeave.controller.js';
import { EmployeeNotifications, MarkNotificationRead, MarkAllNotificationsRead, DeleteEmployeeNotification, DeleteAllEmployeeNotifications, GetEmployeeLeaveBalance } from '../controller/employee.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
      return;
    }
    cb(new Error('Only image files and PDFs are allowed.'));
  },
});

export const userRouter = express.Router()

userRouter.post('/register', handleUserSignUp)
userRouter.post('/login', handleUserLogin)

userRouter.get('/me', userAuthenticateToken, (req, res) => {
  res.json({ user: req.user });
});


userRouter.post('/applyleave', upload.single('document'), handleUserLeave)
userRouter.get('/getleaves', getUserLeaves)
userRouter.post('/edit-leave', editLeave)
userRouter.post('/delete-leave', deleteLeave)

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

userRouter.get('/allleaverequests', getUserLeaves)


userRouter.get('/notifications', userAuthenticateToken, EmployeeNotifications)
userRouter.patch('/notifications/read-all', userAuthenticateToken, MarkAllNotificationsRead)
userRouter.delete('/notifications', userAuthenticateToken, DeleteAllEmployeeNotifications)
userRouter.patch('/notifications/:notificationId/read', userAuthenticateToken, MarkNotificationRead)
userRouter.delete('/notifications/:notificationId', userAuthenticateToken, DeleteEmployeeNotification)


userRouter.get('/leavebalance', userAuthenticateToken, GetEmployeeLeaveBalance)
