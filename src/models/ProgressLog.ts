import mongoose, { Schema } from "mongoose";
import { IProgressLog } from "../interfaces/IProgressLog";

const ProgressLogSchema = new Schema<IProgressLog>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    activityType: { 
        type: String, 
        enum: ["topic", "quiz", "coding", "debugging", "cicd"], 
        required: true 
    },
    activityTable: { type: String, required: true }, 
    activityId: { type: Schema.Types.ObjectId, required: true },
    completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IProgressLog>("ProgressLog", ProgressLogSchema);