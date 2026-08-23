import mongoose from "mongoose";
import bcrypt from 'bcrypt'


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

userSchema.pre("save", async function(next){ // this will run just before saving to db.
    if(!this.isModified("password")) return next(); // this checks if password is modified or not. if not it will return. no need to change

    try {
        const salt = await bcrypt.genSalt(10); // generate a salt.
        this.password = await bcrypt.hash(this.password, salt); // hash my password with help of salt
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

export const User = mongoose.model('User', userSchema)