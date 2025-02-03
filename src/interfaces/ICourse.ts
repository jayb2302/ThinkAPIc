import { Document, Types } from "mongoose";

export interface ICourse extends Document {
    title: string;
    description: string;
    teacher: string;
    scope: string;
    semester: string;
    learningObjectives: string[];
    skills: string[];
    competencies: string[];
    topics: Types.ObjectId[]; 
}