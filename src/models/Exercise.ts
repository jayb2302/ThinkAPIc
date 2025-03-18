import mongoose, { Schema } from "mongoose";
import { IExercise } from "../interfaces/IExercise";
import type { IExerciseQuestion, IExerciseOption } from "../interfaces/IExercise";

const ExerciseOptionSchema = new Schema<IExerciseOption>({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false },
    order: { type: Number }
});

const ExerciseQuestionSchema = new Schema<IExerciseQuestion>({
    question: { type: String, required: true },
    type: { 
        type: String, 
        enum: ["multiple-choice", "fill-in-the-blank", "coding", "short-answer"], 
        required: true 
    },
    correctAnswer: { type: String }, 
    options: { type: [ExerciseOptionSchema], required: function(this: any) { return this.type === "multiple-choice"; } } 
});

const ExerciseSchema = new Schema<IExercise>({
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    hints: { type: [String] },
    solutions: { type: [String] },
    questions: { type: [ExerciseQuestionSchema], required: true }
}, { timestamps: true });

export default mongoose.model<IExercise>("Exercise", ExerciseSchema);