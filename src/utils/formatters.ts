import { ActivityType, ActivityTable } from "../interfaces/IProgressLog";

export const formatQuizAttempts = (attempts: any[]): any[] => {
  return attempts.map((attempt) => ({
    _id: attempt._id,
    user: attempt.user,
    course: {
      _id: attempt.course?._id,
      title: attempt.course?.title,
    },
    topic: {
      _id: attempt.topic?._id,
      title: attempt.topic?.title,
    },
    activityType: ActivityType.QUIZ, 
    activityTable: ActivityTable.QUIZZES, 
    activityId: attempt.activityId?._id, 
    completedAt: attempt.completedAt,
  }));
};