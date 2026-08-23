import 'dotenv/config';
import express from 'express';
import connectDB from './DB/index.js';
const app = express()
const port = 3000

async function startServer(){ 
  try {
    await connectDB() 
    
    app.get('/', (req, res) => {
      res.send('Hello World!')
    })
    
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  } catch (error) {
    console.log('error in MongoDB : ', error);
  }
}

startServer()