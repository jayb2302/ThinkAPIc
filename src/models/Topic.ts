import mongoose, { Schema, Document } from "mongoose";

export interface ITopic extends Document {
  title: string;
  week: number;
  summary: string;
  key_points: string[];
  resources: { title: string; link: string }[];
  course: mongoose.Schema.Types.ObjectId;
}

const TopicSchema = new Schema<ITopic>(
  {
    title: { type: String, required: true, unique: true },
    week: { type: Number, required: true },
    summary: { type: String, required: true },
    key_points: [{ type: String, required: true }],
    resources: [
      {
        title: { type: String, required: true },
        link: { type: String, required: true },
      },
    ],
    course: { type: Schema.Types.ObjectId, ref: "Course" },
  }, { timestamps: true });

export default mongoose.model<ITopic>("Topic", TopicSchema);
