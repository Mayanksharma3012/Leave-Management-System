import { Leave } from "../models/leave.model.js";
import { User } from "../models/user.model.js"
import jwt from 'jsonwebtoken'

export async function handleUserLeave(req, res){
    const token = req.cookies.token;
    // const { title, start, end, endReal, classNames, reason, document, days } = req.body ?? {};

    try {
        // const leave = await Leave.create()
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // const employee = verified.email;
        
        // 1. Find the user by email
        const user = await User.findOne({ email: verified.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { title, start, end, endReal, classNames, reason, document, days } = req.body;

        // 3. Create leave with the user's _id as employee
        const leave = await Leave.create({
            employee: user._id,          // <-- this links the leave to the logged-in user
            leaveType: title,
            startDate: start,
            endDate: end,
            endDateReal: endReal,
            days: days,
            reason: reason,
            document: document,
            status: classNames?.[0] || "pending-leave"
        });

        res.status(201).json({ message: "Leave submitted", leave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export async function getUserLeaves(req, res) {
    const token = req.cookies.token;

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const email = verified.email;

        // 1. Find the user
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Fetch ONLY leaves for this user, sorted newest first
        const leaves = await Leave.find({ employee: user._id })
            .sort({ createdAt: -1 });
            
        res.json({ leaves });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}