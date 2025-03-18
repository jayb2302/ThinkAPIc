import { Document, Types } from "mongoose";

export type IExerciseOption = {
    text: string;
    isCorrect: boolean;
    order?: number;
};

export type IExerciseQuestion = {
    question: string;
    type: "multiple-choice" | "fill-in-the-blank" | "coding" | "short-answer";
    correctAnswer?: string;
    options?: IExerciseOption[];
};

export interface IExercise extends Document {
    topic: Types.ObjectId;
    title: string;
    description?: string;
    difficulty: "easy" | "medium" | "hard";
    hints?: string[];
    solutions?: string[];
    questions: IExerciseQuestion[];
}