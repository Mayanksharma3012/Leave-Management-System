import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './DB/index.js';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/user.route.js';
import { managerRouter } from './routes/manager.route.js';
import path from 'path';
import { fileURLToPath } from 'url';
import {v2 as cloudinary} from 'cloudinary'
// import { authenticateToken } from './middleware/userAuthentication.middleware.js';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

async function startServer() {

const allowedOrigins = [
  "http://localhost:5173",
  "https://leave-management-system-sigma-five.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked CORS origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  try {
    await connectDB();
    app.use('/user', userRouter);
    app.use('/manager', managerRouter);

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log('error in MongoDB : ', error);
  }
}

startServer(); 