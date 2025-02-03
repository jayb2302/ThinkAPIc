import { Schema, model } from "mongoose";
import { ICourse } from "../interfaces/ICourse"; 

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

export default model<ICourse>("Course", CourseSchema);