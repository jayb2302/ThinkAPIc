import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
    title: string;
    description: string;
    teacher: string;
    scope: string;
    semester: string;
    learningObjectives: string[];
    skills: string[];
    competencies: string[];
    topics: mongoose.Schema.Types.ObjectId[];
}

const CourseSchema = new Schema<ICourse>({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    teacher: { type: String, required: true },
    scope: { type: String, required: true }, 
    semester: { type: String, required: true }, 
    learningObjectives: [{ type: String, required: true }],
    skills: [{ type: String, required: true }],
    competencies: [{ type: String, required: true }],
    topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
}, { timestamps: true });

export default mongoose.model<ICourse>("Course", CourseSchema);