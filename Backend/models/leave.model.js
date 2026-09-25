import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leaveType: {
        type: String,
        required: true,
    },
    startDate:{
        type: String,
        required: true
    },
    endDate:{
        type: String,
        required: true
    },
    endDateReal:{
        type: String,
        required: true
    },
    days:{
        type: Number
    },
    reason:{
        type: String,
        required: true,
    },
    document:{
        type: String,
        // Todo
    },
    status:{
        type: String,
        default: "pending-leave"
    }
},{timestamps: true});

export const Leave = mongoose.model('Leave', leaveSchema);