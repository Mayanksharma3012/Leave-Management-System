import { Leave } from "../models/leave.model.js";
import { User } from "../models/user.model.js"
import { Manager } from "../models/manager.model.js";
import { ManagerNotification } from "../models/manager.notification.model.js";
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Readable } from 'stream'
import { v2 as cloudinary } from 'cloudinary'

function uploadDocumentToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'leave-management/documents',
                resource_type: 'auto',
                use_filename: true,
                unique_filename: true,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result?.secure_url) {
                    reject(new Error('Cloudinary did not return a document URL.'));
                    return;
                }
                resolve(result.secure_url);
            }
        );

        Readable.from(file.buffer).pipe(uploadStream);
    });
}

export async function handleUserLeave(req, res) {
    const token = req.cookies.token;

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ email: verified.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { title, start, end, endReal, classNames, reason, days } = req.body ?? {};
        const documentFile = req.file ? await uploadDocumentToCloudinary(req.file) : null;

        let parsedClassNames = classNames;
        if (typeof parsedClassNames === 'string') {
            try {
                parsedClassNames = JSON.parse(parsedClassNames);
            } catch (_error) {
                parsedClassNames = [parsedClassNames];
            }
        }

        const leaveStatus = Array.isArray(parsedClassNames)
            ? parsedClassNames[0]
            : parsedClassNames || 'pending-leave';

        const leave = await Leave.create({
            employee: user._id,
            leaveType: title,
            startDate: start,
            endDate: end,
            endDateReal: endReal,
            days: Number(days) || 0,
            reason: reason,
            document: documentFile,
            status: leaveStatus || 'pending-leave'
        });

        if (user.manager) {
            await ManagerNotification.create({
                managerId: user.manager,
                titleAndMessage: {
                    title: "Leave Request",
                    message: `${user.userName} requested a leave`
                },
                relatedLeaveID: leave._id,
            });
        }
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

        const employee = await User.findById(updatedLeave.employee);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        if (employee.manager) {
            await ManagerNotification.create({
                managerId: employee.manager,
                titleAndMessage: {
                    title: "Leave Request Updated",
                    message: `${employee.userName} edited a leave`
                },
                relatedLeaveID: updatedLeave._id,
            });
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
    const { id } = req.body ?? {}

    try {
        if (!id) {
            return res.status(400).json({ message: "Leave id is required" });
        }
        const leave = await Leave.findById(id);
        if (!leave) {
            return res.status(404).json({ message: "Leave not found" });
        }

        const employee = await User.findById(leave.employee);
        const deletedLeave = await Leave.findByIdAndDelete(id);
        if (!deletedLeave) {
            return res.status(404).json({ message: "Leave not found" });
        }

        if (employee?.manager) {
            await ManagerNotification.create({
                managerId: employee.manager,
                titleAndMessage: {
                    title: "Leave Request Deleted",
                    message: leave.status === 'approved-leave'
                        ? `${employee.userName} cancelled an approved leave`
                        : `${employee.userName} cancelled a leave request`
                },
                relatedLeaveID: deletedLeave._id,
            });
        }

        return res.status(200).json({
            message: "Leave Deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export async function EmployeesLeavesRequests(req, res) {
    try {
        const manager = await Manager.findById(req.user._id).select('employees');
        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        const leaves = await Leave.find({ employee: { $in: manager.employees } })
            .populate('employee', 'userName department avatar_url')
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