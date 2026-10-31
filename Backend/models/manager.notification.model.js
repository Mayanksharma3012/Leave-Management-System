import mongoose from "mongoose";

const managerNotificationSchema = new mongoose.Schema({
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager',
        required: true,
    },
    notificationPreferences: {
        newRequests: { type: Boolean, default: true },
        leaveChanges: { type: Boolean, default: true },
        upcomingAbsences: { type: Boolean, default: false },
        announcements: { type: Boolean, default: true }
    },
    titleAndMessage:{
        title: {type: String, required: true},
        message: {type: String, required: true}
    },
    relatedLeaveID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leave',
    },
    status: {
        type: String,
        enum: ['Read', 'UnRead', 'deleted'],
        default: 'UnRead'
    }
},{timestamps: true}
)

export const ManagerNotification = mongoose.model('ManagerNotification', managerNotificationSchema)