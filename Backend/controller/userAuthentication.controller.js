import {User} from '../models/user.model.js'


export async function handleUserSignUp(req, res){
    const {userName, email, password, department, leaveBalance} = req.body ?? {};

    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }

    try {
        await User.create({
            userName, email, password, department, leaveBalance
        });

        return res.status(201).json({message: 'success'});
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({message: 'Email is already registered'});
        }

        console.error('Error registering user:', error);
        return res.status(500).json({message: 'Unable to register user'});
    }
}