import { Document, Types } from "mongoose";

export type Resource = {
  title: string;
  link: string;
};

export interface ITopic extends Document {
  title: string;
  week: number;
  summary: string;
  key_points: string[];
  resources: Resource[];
  course: Types.ObjectId;
}
