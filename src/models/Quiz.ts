import mongoose, { Schema } from "mongoose";
import { IQuiz, IQuizOption } from "../interfaces/IQuiz";


const QuizOptionSchema = new Schema<IQuizOption>({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false },
    order: { type: Number }
});

const QuizSchema = new Schema<IQuiz>({
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    question: { type: String, unique: true, required: true },
    options: { type: [QuizOptionSchema], required: true }
}, { timestamps: true });

QuizSchema.pre("save", function (next) {
    if (this.isModified("options")) {
        this.options.forEach((option: IQuizOption, index: number) => {
            if (option.order === undefined) {
                option.order = index + 1; 
            }
        });
    }
    next();
});

export default mongoose.model<IQuiz>("Quiz", QuizSchema);