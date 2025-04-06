import { Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  teacher: Types.ObjectId;
  scope: string;
  semester: string;
  learningObjectives: string[];
  skills: string[];
  competencies: string[];
  topics: Types.ObjectId[];
}
