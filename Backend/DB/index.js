import mongoose from "mongoose";
// import { DB_NAME } from '../constant.js'

const connectDB = async () => {
    try {
        const ConnectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}`)
        console.log('MongoDB connected:') //DB host', ConnectionInstance
    } catch (error) {
        console.error(`Error: ${error}`)
        process.exit(1);
    }
}

export default connectDB;