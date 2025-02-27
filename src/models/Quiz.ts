import mongoose, { Schema } from "mongoose";
import { IQuiz, IQuizOption } from "../interfaces/IQuiz";


const QuizOptionSchema = new Schema<IQuizOption>({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false },
    order: { type: Number, required: true }
});

const QuizSchema = new Schema<IQuiz>({
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    question: { type: String, required: true },
    options: { type: [QuizOptionSchema], required: true }
}, { timestamps: true });

export default mongoose.model<IQuiz>("Quiz", QuizSchema);