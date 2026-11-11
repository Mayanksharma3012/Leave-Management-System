import { User } from '../models/user.model.js'
import { getAuth } from 'firebase-admin/auth'
import firebaseApp from '../firebase-admin.js'
import jwt from 'jsonwebtoken'


const secret_Key = process.env.JWT_SECRET_KEY

export async function handleUserLogin(req, res) {
    const { email, password, userName } = req.body ?? {}

    const user = await User.findOne({ email })

    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    else {
        const token = jwt.sign({ email, userName }, secret_Key, { expiresIn: process.env.JWT_EXPIREIN })

        const isProduction = process.env.NODE_ENV === 'production'

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 1296000000
        });
        // return res.json({message: 'success',  ema: email, name: userName, jwtToken: token})
        return res.status(201).json({ message: 'success', ema: email, name: userName, jwtToken: token })

        // const user = await User.findOne({email});
        // if (user) {
        //     // console.log(user); // Returns full user object
        //     return res.json({user: user})
        // } else {
        //     console.log("User not found");
        // }   

    }
}
export async function handleUserSignUp(req, res) {
    const { userName, email, password, department, leaveBalance } = req.body ?? {};

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        await User.create({
            userName, email, password, department, leaveBalance
        });

        const token = jwt.sign({ email, userName }, secret_Key, { expiresIn: process.env.JWT_EXPIREIN })

        const isProduction = process.env.NODE_ENV === 'production'

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 1296000000
        });
        return res.status(201).json({ message: 'success', user: userName, email, department });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Unable to register user' });
    }
}

export async function FireBaseAuthenticaton(req, res) {
    const { idToken, photoURL } = req.body ?? {};

    if (!idToken) {
        return res.status(400).json({ message: 'Firebase ID token is required' });
    }

    try {
        const firebaseAuth = getAuth(firebaseApp);
        const decoded = await firebaseAuth.verifyIdToken(idToken);
        const firebaseUser = await firebaseAuth.getUser(decoded.uid);
        const email = decoded.email || firebaseUser.email;
        const avatarUrl = photoURL || decoded.picture || decoded.photoURL || firebaseUser.photoURL;

        if (!email) {
            return res.status(401).json({ message: 'Firebase account has no email address' });
        }

        let user = await User.findOne({ firebaseUid: decoded.uid });
        if (!user) {
            user = await User.findOne({ email });
        }
        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                email,
                userName: decoded.name || email.split('@')[0],
                avatar_url: avatarUrl
            });
        } else {
            let changed = false
            if (!user.firebaseUid) {
                user.firebaseUid = decoded.uid;
                changed = true;
            }
            if (avatarUrl && user.avatar_url !== avatarUrl) {
                user.avatar_url = avatarUrl;
                changed = true;
            }
            if (changed) await user.save();
        }

        const token = jwt.sign(
            { email: user.email, userName: user.userName },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIREIN }
        );
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 1296000000
        });

        return res.status(200).json({ message: 'success' });
    } catch (error) {
        console.error('Firebase authentication failed:', error.message);
        return res.status(401).json({ message: 'Invalid or expired Firebase token' });
    }
}

export async function handlePasswordChange(req, res) {
    const { currentPassword, newPassword, confirmPassword } = req.body ?? {}

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'Current password, new password, and confirmation are required' })
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New passwords do not match' })
    }
    const token = req.cookies?.token
    if (!token) {
        return res.status(401).json({ error: 'You must be signed in to change your password' })
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ email: verified.email })
        if (!user) return res.status(401).json({ error: 'User not found' });

        const isMatch = await user.matchPassword(currentPassword)
        if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' })

        user.password = newPassword
        await user.save()
        return res.status(200).json({ message: 'Password changed successfully' })


    } catch (error) {
        console.error('Error changing password:', error)
        return res.status(500).json({ error: 'Unable to change password' })
    }
}