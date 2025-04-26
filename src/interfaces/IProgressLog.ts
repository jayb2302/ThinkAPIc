import { Document, Types } from "mongoose";

export enum ActivityType {
    TOPIC = "topic",
    QUIZ = "quiz",
    EXERCISE = "exercise",
    CODING = "coding",
    DEBUGGING = "debugging",
    CICD = "cicd",
}

export enum ActivityTable {
    TOPICS = "topics",
    QUIZZES = "quizzes",
    EXERCISES = "exercises",
    CODING_CHALLENGES = "coding_challenges",
    DEBUGGING_TASKS = "debugging_tasks",
    CICD_EXERCISES = "cicd_exercises",
}

export interface IProgressLog extends Document {
    user: Types.ObjectId;
    course: Types.ObjectId;
    topic?: Types.ObjectId;
    activityType: ActivityType;
    activityTable: ActivityTable;
    activityId: Types.ObjectId;
    completedAt: Date;
    isCorrect: boolean;
}