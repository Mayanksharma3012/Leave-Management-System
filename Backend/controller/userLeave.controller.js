import { Leave } from "../models/leave.model.js";
import { User } from "../models/user.model.js"
import { Manager } from "../models/manager.model.js";
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

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

export async function editLeave(req, res) {
  const { id, title, start, end, endReal, status, days, reason } = req.body ?? {};

  try {
    if (!id) {
      return res.status(400).json({ message: "Leave id is required" });
    }
    
    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      {
        leaveType: title,
        startDate: start,
        endDate: end,
        endDateReal: endReal,
        days,
        reason,
        status: status || "pending-leave"
    },
      { new: true }
    );

    if (!updatedLeave) {
        return res.status(404).json({ message: "Leave not found" });
    }

    return res.status(200).json({
      message: "Leave updated successfully",
      leave: updatedLeave
    });
} catch (error) {
    return res.status(500).json({ message: error.message });
}
}

export async function deleteLeave(req, res) {
    const {id} = req.body ?? {}
    
    try {
        if (!id) {
            return res.status(400).json({ message: "Leave id is required" });
        }
        const delete_leave = await Leave.findByIdAndDelete(id)
        if (!delete_leave) {
            return res.status(404).json({ message: "Leave not found" });
        }
        
        return res.status(200).json({
          message: "Leave Deleted successfully",
        });
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export async function EmployeesLeavesRequests(req, res){
    try {
        const manager = await Manager.findById(req.user._id).select('employees');
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        const leaves = await Leave.find({ employee: { $in: manager.employees } })
            .populate('employee', 'userName department')
            .sort({ createdAt: -1 });

        return res.status(200).json({ leaves });
    } catch (error) {
        console.error('Error retrieving manager leave requests:', error);
        return res.status(500).json({ message: 'Unable to retrieve leave requests' });
    }
}

export async function reviewLeaveRequest(req, res) {
    const { leaveId } = req.params;
    const { status } = req.body ?? {};

    if (!mongoose.isValidObjectId(leaveId)) {
        return res.status(400).json({ message: 'A valid leave request id is required' });
    }
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    try {
        const manager = await Manager.findById(req.user._id).select('employees');
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        const leave = await Leave.findOneAndUpdate(
            {
                _id: leaveId,
                employee: { $in: manager.employees },
                status: { $in: ['pending-leave', 'pending'] }
            },
            { status: `${status}-leave` },
            { new: true }
        );
        if (!leave) {
            return res.status(404).json({ message: 'Pending leave request not found' });
        }

        return res.status(200).json({ message: 'Leave request reviewed successfully', leave });
    } catch (error) {
        console.error('Error reviewing manager leave request:', error);
        return res.status(500).json({ message: 'Unable to review leave request' });
    }
}