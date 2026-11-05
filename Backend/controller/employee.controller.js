import mongoose from "mongoose";
import { EmployeeNotification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

export async function EmployeeNotifications(req, res) {
    try {
        const id = req.user?._id

        if (!id) {
            return res.status(401).json({ message: 'employee authentication is required' })
        }

        // const employee = await EmployeeNotification.findOne({employeeId: id})
        const notifications = await EmployeeNotification.find({
            employeeId: id
        }).sort({ createdAt: -1 });

        res.status(200).json({ notifications })

    } catch (error) {
        return res.status(500).json({ message: 'Unable to retrieve employee notifications' })

    }
}

export async function MarkNotificationRead(req, res) {
    try {
        const employeeId = req.user?._id
        const { notificationId } = req.params

        if (!employeeId) {
            return res.status(401).json({ message: 'employee authentication is required' })
        }
        if (!mongoose.isValidObjectId(notificationId)) {
            return res.status(400).json({ message: 'A valid notification id is required' })
        }

        const notification = await EmployeeNotification.findOneAndUpdate(
            { _id: notificationId, employeeId },
            { status: 'Read' },
            { returnDocument: 'after' } 
        )

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' })
        }

        return res.status(200).json({ notification })
    } catch (error) {
        console.error('Error marking notification as read:', error)
        return res.status(500).json({ message: 'Unable to mark notification as read' })
    }
}

export async function MarkAllNotificationsRead(req, res) {
    try {
        const employeeId = req.user?._id
        if (!employeeId) {
            return res.status(401).json({ message: 'employee authentication is required' })
        }

        await EmployeeNotification.updateMany(
            { employeeId, status: 'UnRead' },
            { status: 'Read' }
        )
        return res.status(200).json({ message: 'All notifications marked as read' })
    } catch (error) {
        console.error('Error marking all notifications as read:', error)
        return res.status(500).json({ message: 'Unable to mark all notifications as read' })
    }
}

export async function DeleteEmployeeNotification(req, res) {
    try {
        const employeeId = req.user?._id
        const { notificationId } = req.params
        
        if (!employeeId) {
            return res.status(401).json({ message: 'employee authentication is required' })
        }
        if (!mongoose.isValidObjectId(notificationId)) {
            return res.status(400).json({ message: 'A valid notification id is required' })
        }
        
        const notification = await EmployeeNotification.findOneAndDelete({ _id: notificationId, employeeId })
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' })
        }
        
        return res.status(200).json({ message: 'Notification deleted' })
    } catch (error) {
        console.error('Error deleting notification:', error)
        return res.status(500).json({ message: 'Unable to delete notification' })
    }
}

export async function DeleteAllEmployeeNotifications(req, res) {
    try {
        const employeeId = req.user?._id
        if (!employeeId) {
            return res.status(401).json({ message: 'employee authentication is required' })
        }

        await EmployeeNotification.deleteMany({ employeeId })
        return res.status(200).json({ message: 'All notifications deleted' })
    } catch (error) {
        console.error('Error deleting all notifications:', error)
        return res.status(500).json({ message: 'Unable to delete all notifications' })
    }
}

export async function GetEmployeeLeaveBalance(req, res) {
    const employeeId = req.user?._id;
    if (!employeeId) {
        return res.status(401).json({ message: 'employee authentication is required' });
    }

    try {
        const user = await User.findById(employeeId).select('leaveBalance');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ leaveBalance: user.leaveBalance });
    } catch (error) {
        console.error('Error retrieving employee leave balance:', error);
        return res.status(500).json({ message: 'Unable to retrieve leave balance' });
    }
}