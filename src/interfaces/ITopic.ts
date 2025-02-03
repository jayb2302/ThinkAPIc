import { Document, Types } from "mongoose";

export interface ITopic extends Document {
    title: string;
    week: number;
    summary: string;
    key_points: string[];
    resources: { title: string; link: string }[];
    course: Types.ObjectId; 
}