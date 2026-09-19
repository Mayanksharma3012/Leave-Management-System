import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export async function handleUserSignUp(req, res) {
    const { userName, email, password, department, leaveBalance } = req.body ?? {};

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        await User.create({
            userName, email, password, department, leaveBalance
        });

        return res.status(201).json({ message: 'success', user: userName, ema: email, pass: password, d: department, lb: leaveBalance });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Unable to register user' });
    }
}

const secret_Key = process.env.JWT_SECRET_KEY

export async function handleUserLogin(req, res) {
    const { email, password, userName } = req.body ?? {}

    const user = await User.findOne({email}) 
    
    if(!user) return res.status(401).json({message: 'Invalid email or password'});

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return res.status(401).json({message: 'Invalid email or password'});
    }
    else{
        const token = jwt.sign({email, userName},secret_Key,{expiresIn:process.env.JWT_EXPIREIN})

        const isProduction = process.env.NODE_ENV === 'production'

        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax', 
            maxAge: 1296000000
        })
        // return res.json({message: 'success',  ema: email, name: userName, jwtToken: token})
        return res.status(201).json({message: 'success',  ema: email, name: userName, jwtToken: token})   
        
        // const user = await User.findOne({email});
        // if (user) {
        //     // console.log(user); // Returns full user object
        //     return res.json({user: user})
        // } else {
        //     console.log("User not found");
        // }   

    }
}