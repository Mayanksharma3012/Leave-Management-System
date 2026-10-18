import { User } from "../models/user.model.js";
import { Manager } from "../models/manager.model.js";
import mongoose from 'mongoose'

export async function AvailableEmployees(req, res) {
    try {
        const users = await User.find({
            manager: null
        }).select('userName email department');

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
            .populate('employees', 'userName email department createdAt')
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