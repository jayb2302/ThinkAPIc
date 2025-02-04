import { Document, Types } from "mongoose";

export interface IQuizOption {
    text: string;
    isCorrect: boolean;
}

export interface IQuiz extends Document {
    topic: Types.ObjectId;
    question: string;
    options: IQuizOption[];
}