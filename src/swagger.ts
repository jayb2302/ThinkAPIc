import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

export function setupDocs(app: Application) {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "ThinkAPIc Documentation",
      version: "1.0.0",
      description: "REST API documentation for ThinkAPIc",
    },
    servers: [
      { url: "http://localhost:4000/", description: "Local API" },
      // { url: 'https://thinkapic.onrender.com/api', description: 'Production API' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
            type: "object",
            required: ["username", "email", "password"],
            properties: {
                id: { type: "string", description: "User ID", example: "67a1fb6a19841151773d89b1" },
                username: { type: "string", example: "jaybeaver" },
                email: { type: "string", example: "jonina@example.com" },
                password: { 
                    type: "string", 
                    description: "User's password (not included in responses)", 
                    example: "securepassword",
                    writeOnly: true // ✅ Ensures password is only in request, never in responses
                },
                role: {
                    type: "string",
                    enum: ["student", "admin"],
                    description: "User role (student has limited access, admin can manage users)",
                    example: "student",
                },
                createdAt: { type: "string", format: "date-time", example: "2025-02-04T11:35:06.685Z" },
                updatedAt: { type: "string", format: "date-time", example: "2025-02-27T09:44:31.060Z" },
            },
        },
        LoginRequest: {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: { 
                    type: "string", 
                    description: "User's email address", 
                    example: "jonina@example.com" 
                },
                password: { 
                    type: "string", 
                    description: "User's password", 
                    example: "securepassword",
                    writeOnly: true
                },
            },
        },
        LoginResponse: {
            type: "object",
            properties: {
                token: {
                    type: "string",
                    description: "JWT access token",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
                userId: {
                    type: "string",
                    description: "ID of the authenticated user",
                    example: "67a1fb6a19841151773d89b1",
                }
            },
        },
        Course: {
          type: "object",
          required: ["title", "description", "teacher", "scope", "semester"],
          properties: {
            id: { type: "string", description: "Course ID" },
            title: { type: "string", example: "Web Development" },
            description: {
              type: "string",
              example: "Learn full-stack web development",
            },
            teacher: { type: "string", example: "Dr. Jane Doe" },
            scope: { type: "string", example: "Full-time" },
            semester: { type: "string", example: "Fall 2024" },
            learningObjectives: { type: "array", items: { type: "string" } },
            skills: { type: "array", items: { type: "string" } },
            competencies: { type: "array", items: { type: "string" } },
            topics: {
              type: "array",
              items: { type: "string" },
              description: "IDs of related topics",
            },
          },
        },
        Topic: {
          type: "object",
          required: ["title", "week", "summary", "key_points"],
          properties: {
            id: { type: "string", description: "Topic ID" },
            title: { type: "string", example: "Introduction to JavaScript" },
            week: { type: "integer", example: 1 },
            summary: {
              type: "string",
              example: "Basic JavaScript concepts and syntax.",
            },
            key_points: { type: "array", items: { type: "string" } },
            resources: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string", example: "MDN JavaScript Guide" },
                  link: {
                    type: "string",
                    example:
                      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
                  },
                },
              },
            },
            course: {
              type: "string",
              description: "Course ID this topic belongs to",
            },
          },
        },
        Quiz: {
            type: "object",
            required: ["topic", "question", "options"],
            properties: {
                id: { type: "string", description: "Quiz ID" },
                topic: { type: "string", description: "Topic ID" },
                question: { type: "string", example: "What is REST?" },
                options: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            text: { type: "string", example: "An architecture style" },
                            isCorrect: { type: "boolean", example: true },
                            order: { type: "integer", example: 1 },
                        },
                    },
                },
                createdAt: { type: "string", format: "date-time", example: "2025-02-04T11:35:06.685Z" },
                updatedAt: { type: "string", format: "date-time", example: "2025-02-27T09:44:31.060Z" },
            
            }
        },
        ProgressLog: {
          type: "object",
          required: ["user", "course", "activityType", "activityId"],
          properties: {
            id: { type: "string", description: "ProgressLog ID" },
            user: { type: "string", description: "User ID" },
            course: { type: "string", description: "Course ID" },
            activityType: {
              type: "string",
              enum: ["topic", "quiz", "coding", "debugging", "cicd"],
              example: "quiz",
            },
            activityTable: { type: "string", example: "Quiz" },
            activityId: { type: "string", description: "Activity ID" },
            completedAt: {
              type: "string",
              format: "date-time",
              example: "2024-02-25T12:00:00Z",
            },
          },
        },
        QuizAttempt: {
          type: "object",
          required: ["userId", "quizId", "isCorrect", "score"],
          properties: {
            attemptId: { type: "string", description: "Quiz Attempt ID", example: "67a0ae68731a99cc163a7fc8" },
            userId: { type: "string", description: "User ID who attempted the quiz", example: "67c4d034e1968c13a337c8c3" },
            quizId: { type: "string", description: "Quiz ID being attempted", example: "67a9250ec86b3d5afdafa87e" },
            isCorrect: { type: "boolean", description: "Whether the selected answer was correct", example: true },
            completedAt: { type: "string", format: "date-time", description: "Time when the attempt was completed", example: "2025-02-10T12:30:00Z" }
          },
        },
      },
    },
  };

  const options = {
    swaggerDefinition,
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
  };

  const swaggerSpec = swaggerJsdoc(options);
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
