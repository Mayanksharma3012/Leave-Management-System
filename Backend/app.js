import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './DB/index.js';
import { userRouter } from './routes/userAuthentication.route.js';

const app = express()
const port = 3000

async function startServer(){ 

  app.use(cors({
    origin: 'http://localhost:5173'
  }    
))  
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))  // ← AND THIS for form data

  try {
    await connectDB() 
    //todo create Authentation controller
    app.use('/user', userRouter)
  
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  } catch (error) {
    console.log('error in MongoDB : ', error);
  }
}

startServer()