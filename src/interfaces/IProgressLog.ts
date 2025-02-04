import { Document, Types } from "mongoose";

export interface IProgressLog extends Document {
    user: Types.ObjectId;
    course: Types.ObjectId;
    activityType: "topic" | "quiz" | "coding" | "debugging" | "cicd";
    activityTable: string;
    activityId: Types.ObjectId;
    completedAt: Date;
}