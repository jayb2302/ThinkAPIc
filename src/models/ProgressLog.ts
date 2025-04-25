import mongoose, { Schema } from "mongoose";
import { IProgressLog, ActivityType ,ActivityTable } from "../interfaces/IProgressLog";

const ProgressLogSchema = new Schema<IProgressLog>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    activityType: { 
        type: String, 
        enum: Object.values(ActivityType),
        required: true 
    },
    activityTable: { 
        type: String,
        enum: Object.values(ActivityTable), 
        required: true 
    }, 
    activityId: { type: Schema.Types.ObjectId, required: true, index: true },
    completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IProgressLog>("ProgressLog", ProgressLogSchema);