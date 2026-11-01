import { User } from "../models/user.model.js";
import { Manager } from "../models/manager.model.js";
import { ManagerNotification } from "../models/notification.model.js";
import mongoose from 'mongoose'

export async function AvailableEmployees(req, res) {
    try {
        const users = await User.find({
            manager: null
        }).select('userName email department avatar_url');

        return res.status(200).json({
            message: users.length
                ? 'Available employees retrieved successfully'
                : 'No available employees found',
            employees: users
        });
    } catch (error) {
        console.error('Error retrieving available employees:', error);
        return res.status(500).json({
            message: 'Unable to retrieve available employees'
        });
    }
}

export async function ManagerEmployees(req, res) {
    try {
        const manager = await Manager.findById(req.user._id)
            .populate('employees', 'userName email department avatar_url createdAt')
            .select('employees');

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        return res.status(200).json({
            message: 'Manager employees retrieved successfully',
            employees: manager.employees
        });
    } catch (error) {
        console.error('Error retrieving manager employees:', error);
        return res.status(500).json({
            message: 'Unable to retrieve manager employees'
        });
    }
}

export async function AddEmployee(req, res){
    const { id } = req.body ?? {}

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'A valid employee id is required' })
    }

    if (!req.user?._id) {
        return res.status(401).json({ message: 'Manager authentication is required' })
    }

    let session
    try {
        session = await mongoose.startSession()
        let employee

        await session.withTransaction(async () => {
            const manager = await Manager.findById(req.user._id).session(session)
            if (!manager) {
                const error = new Error('Manager not found')
                error.status = 401
                throw error
            }

            employee = await User.findById(id).session(session)
            if (!employee) {
                const error = new Error('Employee not found')
                error.status = 404
                throw error
            }

            if (employee.manager && !employee.manager.equals(manager._id)) {
                const error = new Error('Employee is already assigned to another manager')
                error.status = 409
                throw error
            }

            employee.manager = manager._id
            manager.employees.addToSet(employee._id)

            await employee.save({ session })
            await manager.save({ session })
        })

        return res.status(200).json({
            message: 'Employee added successfully',
            employee: {
                id: employee._id,
                userName: employee.userName,
                email: employee.email,
                manager: req.user._id
            }
        })
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message })
        }

        console.error('Error adding employee to manager:', error)
        return res.status(500).json({ message: 'Unable to add employee' })
    } finally {
        if (session) await session.endSession()
    }
}

export async function ManagerDetails(req, res) {
    try {
        const managerId = req.user?._id

        if (!managerId) {
            return res.status(401).json({ message: 'Manager authentication is required' })
        }
        
        const manager = await Manager.findById(managerId)
            .select('email userName avatar_url department')

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' })
        }

        return res.status(200).json({
            message: 'success',
            user: {
                email: manager.email,
                userName: manager.userName,
                avatar_url: manager.avatar_url,
                department: manager.department
            }
        })
    } catch (error) {
        console.error('Error retrieving manager details:', error)
        return res.status(500).json({ message: 'Unable to retrieve manager details' })
    }
}

export async function MarkNotificationRead(req, res) {
    try {
        const managerId = req.user?._id
        const { notificationId } = req.params

        if (!managerId) {
            return res.status(401).json({ message: 'Manager authentication is required' })
        }
        if (!mongoose.isValidObjectId(notificationId)) {
            return res.status(400).json({ message: 'A valid notification id is required' })
        }

        const notification = await ManagerNotification.findOneAndUpdate(
            { _id: notificationId, managerId },
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
        const managerId = req.user?._id
        if (!managerId) {
            return res.status(401).json({ message: 'Manager authentication is required' })
        }

        await ManagerNotification.updateMany(
            { managerId, status: 'UnRead' },
            { status: 'Read' }
        )
        return res.status(200).json({ message: 'All notifications marked as read' })
    } catch (error) {
        console.error('Error marking all notifications as read:', error)
        return res.status(500).json({ message: 'Unable to mark all notifications as read' })
    }
}

export async function DeleteManagerNotification(req, res) {
    try {
        const managerId = req.user?._id
        const { notificationId } = req.params

        if (!managerId) {
            return res.status(401).json({ message: 'Manager authentication is required' })
        }
        if (!mongoose.isValidObjectId(notificationId)) {
            return res.status(400).json({ message: 'A valid notification id is required' })
        }

        const notification = await ManagerNotification.findOneAndDelete({ _id: notificationId, managerId })
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' })
        }

        return res.status(200).json({ message: 'Notification deleted' })
    } catch (error) {
        console.error('Error deleting notification:', error)
        return res.status(500).json({ message: 'Unable to delete notification' })
    }
}

export async function DeleteAllManagerNotifications(req, res) {
    try {
        const managerId = req.user?._id
        if (!managerId) {
            return res.status(401).json({ message: 'Manager authentication is required' })
        }

        await ManagerNotification.deleteMany({ managerId })
        return res.status(200).json({ message: 'All notifications deleted' })
    } catch (error) {
        console.error('Error deleting all notifications:', error)
        return res.status(500).json({ message: 'Unable to delete all notifications' })
    }
}

export async function ManagerNotifications(req, res){
    try {
        const id = req.user?._id
        
        if (!id) {
            return res.status(401).json({ message: 'Manager authentication is required' })
        }

        // const manager = await ManagerNotification.findOne({managerId: id})
        const notifications = await ManagerNotification.find({
            managerId: id
        }).sort({ createdAt: -1 });

        res.status(200).json({notifications})

    } catch (error) {
        return res.status(500).json({ message: 'Unable to retrieve manager notifications' })
        
    }
}
