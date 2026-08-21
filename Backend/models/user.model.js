import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        required: true,
        type: String,
    },
    email:{
        type: String,
        required: true, 
        isUnique: true,
    },
    password:{
        type: String,
        required: true,
    },
    department:{
        type: String,
        required: true,
    },
    leaveBalance:{
        type: Number,
        required: true
    }

},{timestamps: true})

export const User = mongoose.model('User', userSchema)