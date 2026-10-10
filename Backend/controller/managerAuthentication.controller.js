import jwt from 'jsonwebtoken'
import { Manager } from '../models/manager.model.js';

function createManagerToken(manager) {
    return jwt.sign(
        { email: manager.email, userName: manager.userName },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIREIN }
    )
}

function setManagerCookie(res, token) {
    const isProduction = process.env.NODE_ENV === 'production'

    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 1296000000
    })
}

export async function handleManagerSignUp(req, res) {
    const { userName, email, password, department} = req.body ?? {};

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const token = createManagerToken({ email, userName })

        await Manager.create({
            userName, email, password, department
        });

        setManagerCookie(res, token)
        return res.status(201).json({ message: 'success', user: userName, email, department });
    } catch (error) {
        if (error.code === 11000 && (error.keyPattern?.email || error.keyValue?.email)) {
            try {
                const existingManager = await Manager.findOne({ email })
                const isSamePassword = existingManager?.password
                    && await existingManager.matchPassword(password)

                if (isSamePassword) {
                    const token = createManagerToken(existingManager)
                    setManagerCookie(res, token)
                    return res.status(200).json({
                        message: 'success',
                        user: existingManager.userName,
                        email: existingManager.email,
                        department: existingManager.department
                    })
                }
            } catch (verificationError) {
                console.error('Error verifying existing manager account:', verificationError);
                return res.status(500).json({ message: 'Unable to verify manager account' });
            }

            return res.status(409).json({ message: 'A manager account with this email is already registered' });
        }

        console.error('Error registering manager:', error);
        return res.status(500).json({ message: 'Unable to register manager' });
    }
}