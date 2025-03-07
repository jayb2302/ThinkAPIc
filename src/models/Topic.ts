import { Resource } from "./../interfaces/ITopic";
import mongoose, { Schema } from "mongoose";
import { ITopic } from "../interfaces/ITopic";

const ResourceSchema = new Schema<Resource>(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
  },
  { _id: false }
);

const TopicSchema = new Schema<ITopic>(
  {
    title: { type: String, required: true, unique: true },
    week: { type: Number, required: true },
    summary: { type: String, required: true },
    key_points: [{ type: String, required: true }],
    resources: [ResourceSchema],
    course: { type: Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);

export default mongoose.model<ITopic>("Topic", TopicSchema);
