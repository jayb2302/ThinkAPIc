import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

export function setupDocs(app: Application) {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "ThinkAPIc Documentation",
      version: "1.0.0",
      description:
        "REST API documentation for ThinkAPIc. - Login to access the API",
    },
    servers: [
      { url: "http://localhost:4000/api", description: "Local API" },
      { url: 'https://thinkapic.onrender.com/api', description: 'Production API' },
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
        // User: {
        //   type: "object",
        //   required: ["username", "email", "password"],
        //   properties: {
        //     id: {
        //       type: "string",
        //       description: "User ID",
        //       example: "67a1fb6a19841151773d89b1",
        //     },
        //     username: { type: "string", example: "jaybeaver" },
        //     email: { type: "string", example: "jonina@example.com" },
        //     password: {
        //       type: "string",
        //       description: "User's password (not included in responses)",
        //       example: "securepassword",
        //       writeOnly: true,
        //     },
        //     role: {
        //       type: "string",
        //       enum: ["student", "admin"],
        //       description:
        //         "User role (student has limited access, admin can manage users)",
        //       example: "student",
        //     },
        //     createdAt: {
        //       type: "string",
        //       format: "date-time",
        //       example: "2025-02-04T11:35:06.685Z",
        //     },
        //     updatedAt: {
        //       type: "string",
        //       format: "date-time",
        //       example: "2025-02-27T09:44:31.060Z",
        //     },
        //   },
        // },
        UserRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "jaybeaver" },
            email: { type: "string", example: "jonina@example.com" },
            password: {
              type: "string",
              description: "User's password (not included in responses)",
              example: "securepassword",
              writeOnly: true,
            },
            role: {
              type: "string",
              enum: ["student", "admin"],
              description: "User role (default: student)",
              example: "student",
            },
          },
        },
        UserResponse: {
          allOf: [
            { $ref: "#/components/schemas/UserRequest" }, 
            {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  description: "User ID",
                  example: "67a1fb6a19841151773d89b1",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-02-04T11:35:06.685Z",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-02-27T09:44:31.060Z",
                },
              },
            },
          ],
        },
        // Course: {
        //   type: "object",
        //   required: ["title", "description", "teacher", "scope", "semester"],
        //   properties: {
        //     id: { type: "string", description: "Course ID" },
        //     title: { type: "string", example: "Web Development" },
        //     description: {
        //       type: "string",
        //       example: "Learn full-stack web development",
        //     },
        //     teacher: { type: "string", example: "Dr. Jane Doe" },
        //     scope: { type: "string", example: "Full-time" },
        //     semester: { type: "string", example: "Fall 2024" },
        //     learningObjectives: { type: "array", items: { type: "string" } },
        //     skills: { type: "array", items: { type: "string" } },
        //     competencies: { type: "array", items: { type: "string" } },
        //     topics: {
        //       type: "array",
        //       items: { type: "string" },
        //       description: "IDs of related topics",
        //     },
        //   },
        // },
        CourseRequest: {
          type: "object",
          required: ["title", "description", "teacher", "scope", "semester"],
          properties: {
            title: { type: "string", example: "Web Development" },
            description: { type: "string", example: "Learn full-stack web development" },
            teacher: { type: "string", example: "Dr. Jane Doe" },
            scope: { type: "string", example: "Full-time" },
            semester: { type: "string", example: "Fall 2024" },
            learningObjectives: { 
              type: "array", 
              items: { type: "string" }, 
              example: ["Understand full-stack development", "Learn APIs"] 
            },
            skills: { 
              type: "array", 
              items: { type: "string" }, 
              example: ["JavaScript", "TypeScript", "Node.js"] 
            },
            competencies: { 
              type: "array", 
              items: { type: "string" }, 
              example: ["REST API design", "Database management"] 
            },
            topics: {
              type: "array",
              items: { type: "string" },
              description: "IDs of related topics",
              example: ["679b42460a99919e3b623a76", "679b42460a99919e3b623a78"],
            },
          },
        },
        CourseResponse: {
          allOf: [
            { $ref: "#/components/schemas/CourseRequest" }, 
            {
              type: "object",
              properties: {
                _id: { type: "string", description: "Course ID", example: "679b42460a99919e3b623a74" },
                topics: { 
                  type: "array",
                  description: "Detailed topic information",
                  items: { $ref: "#/components/schemas/TopicResponse" }, 
                },
              },
            },
          ],
        },
        // Topic: {
        //   type: "object",
        //   required: ["title", "week", "summary", "key_points"],
        //   properties: {
        //     id: { type: "string", description: "Topic ID" },
        //     title: { type: "string", example: "Topic Title" },
        //     week: { type: "integer", example: 1 },
        //     summary: {
        //       type: "string",
        //       example: "Short summary of the topic",
        //     },
        //     key_points: { 
        //       type: "array", 
        //       items: { type: "string" },
        //       example: [
        //         "What is an API?",
        //         "What is REST and why is it important?",
        //         "The Six REST Constraints",
        //         "Exploring Public REST APIs",
        //       ],
        //       },
        //     resources: {
        //       type: "array",
        //       items: {
        //         type: "object",
        //         properties: {
        //           title: { type: "string", example: "Title of Recourse" },
        //           link: {
        //             type: "string",
        //             example: "https://example-resource.com",
        //           },
        //         },
        //       },
        //     },
        //     course: {
        //       type: "string",
        //       description: "Course ID this topic belongs to",
        //       example: "679b42460a99919e3b623a74"
        //     },
        //   },
        // },
        TopicRequest: {
          type: "object",
          required: ["title", "week", "summary", "key_points", "course"],
          properties: {
            title: { type: "string", example: "Topic Title" },
            week: { type: "integer", example: 1 },
            summary: { type: "string", example: "Short summary of the topic" },
            key_points: {
              type: "array",
              items: { type: "string" },
              example: [
                "What is an API?",
                "What is REST and why is it important?",
                "The Six REST Constraints",
                "Exploring Public REST APIs",
              ],
            },
            resources: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Resource",
              },
            },
            course: {
              type: "string",
              description: "Course ID this topic belongs to",
              example: "679b42460a99919e3b623a74",
            },
          },
        },
        TopicResponse: {
          allOf: [
            { $ref: "#/components/schemas/TopicRequest" }, 
            {
              type: "object",
              properties: {
                _id: { type: "string", description: "Topic ID", example: "679b42460a99919e3b623a76" },
                course: { $ref: "#/components/schemas/CourseResponse" },
              },
            },
          ],
        },
        // Quiz: {
        //   type: "object",
        //   required: ["topic", "question", "options"],
        //   properties: {
        //     id: {
        //       type: "string",
        //       description: "Quiz ID",
        //       example: "67a9250ec86b3d5afdafa87e",
        //     },
        //     topic: { type: "string", description: "Topic ID" },
        //     question: { type: "string", example: "What is REST?" },
        //     options: {
        //       type: "array",
        //       description: "List of answer options",
        //       minItems: 2,
        //       items: {
        //         type: "object",
        //         properties: {
        //           text: { type: "string", example: "An architecture style" },
        //           isCorrect: { type: "boolean", example: true },
        //           order: { type: "integer", example: 1 },
        //         },
        //       },
        //     },
        //     createdAt: {
        //       type: "string",
        //       format: "date-time",
        //       example: "2025-02-04T11:35:06.685Z",
        //     },
        //     updatedAt: {
        //       type: "string",
        //       format: "date-time",
        //       example: "2025-02-27T09:44:31.060Z",
        //     },
        //   },
        // },
        QuizRequest: {
          type: "object",
          required: ["topic", "question", "options"],
          properties: {
            topic: { type: "string", description: "Topic ID", example: "679b42460a99919e3b623a76" },
            question: { type: "string", description: "The quiz question", example: "What is REST?" },
            options: {
              type: "array",
              description: "List of answer options",
              minItems: 2,
              items: {
                type: "object",
                properties: {
                  text: { type: "string", example: "An architecture style" },
                  isCorrect: { type: "boolean", example: true },
                },
              },
            },
          },
        },
        
        QuizResponse: {
          allOf: [
            { $ref: "#/components/schemas/QuizRequest" },
            {
              type: "object",
              properties: {
                _id: { type: "string", description: "Quiz ID", example: "67a9250ec86b3d5afdafa87e" },
                createdAt: { type: "string", format: "date-time", example: "2025-02-04T11:35:06.685Z" },
                updatedAt: { type: "string", format: "date-time", example: "2025-02-27T09:44:31.060Z" },
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
              },
            },
          ],
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

        // 🔵 Other Schemas (Requests, Responses, etc.)
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              description: "User's email address",
              example: "jonina@example.com",
            },
            password: {
              type: "string",
              description: "User's password",
              example: "securepassword",
              writeOnly: true,
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
            },
          },
        },
        Resource: {
          type: "object",
          description: "A learning resource related to the topic.",
          required: ["title", "link"],
          properties: {
            title: {
              type: "string",
              description: "Title of the resource",
              example: "REST API Basics - MDN",
            },
            link: {
              type: "string",
              description: "URL to the resource",
              example: "https://developer.mozilla.org/en-US/docs/Web/HTTP/REST",
            },
          },
        },
        QuizAttempt: {
          type: "object",
          required: ["userId", "quizId", "isCorrect", "score"],
          properties: {
            attemptId: {
              type: "string",
              description: "Quiz Attempt ID",
              example: "67a0ae68731a99cc163a7fc8",
            },
            userId: {
              type: "string",
              description: "User ID who attempted the quiz",
              example: "67c4d034e1968c13a337c8c3",
            },
            quizId: {
              type: "string",
              description: "Quiz ID being attempted",
              example: "67a9250ec86b3d5afdafa87e",
            },
            isCorrect: {
              type: "boolean",
              description: "Whether the selected answer was correct",
              example: true,
            },
            completedAt: {
              type: "string",
              format: "date-time",
              description: "Time when the attempt was completed",
              example: "2025-02-10T12:30:00Z",
            },
          },
        },
        QuizAttemptRequest: {
          type: "object",
          required: ["userId", "selectedOptionOrder", "courseId"],
          properties: {
            selectedOptionOrder: {
              type: "integer",
              description:
                "The order of the selected answer option (1-based index)",
              example: 3,
            },
            courseId: {
              type: "string",
              description: "The ID of the course related to the quiz",
              example: "679b42460a99919e3b623a74",
            },
          },
        },
        QuizAttemptResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Response message",
              example: "Quiz attempt logged",
            },
            isCorrect: {
              type: "boolean",
              description: "Indicates if the selected option was correct",
              example: true,
            },
            topicId: {
              type: "string",
              description: "The ID of the topic associated with the quiz",
              example: "679b42460a99919e3b623a76",
            },
          },
        },
        UserQuizAttemptsResponse: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Quiz Attempt ID",
              example: "67caf92e417a6899f2fdf893",
            },
            user: {
              type: "string",
              description: "User ID who attempted the quiz",
              example: "67c4d034e1968c13a337c8c3",
            },
            course: {
              type: "object",
              description: "Course details related to the quiz attempt",
              properties: {
                _id: {
                  type: "string",
                  description: "Course ID",
                  example: "679b42460a99919e3b623a74",
                },
                title: {
                  type: "string",
                  description: "Course title",
                  example: "REST API Development",
                },
              },
            },
            topic: {
              type: "string",
              description: "Topic ID associated with the quiz attempt",
              example: "679b42460a99919e3b623a76",
            },
            activityType: {
              type: "string",
              enum: ["quiz"],
              description: "Type of activity recorded",
              example: "quiz",
            },
            activityTable: {
              type: "string",
              description: "The table in the database where the activity is recorded",
              example: "quizzes",
            },
            activityId: {
              type: "string",
              description: "ID of the quiz that was attempted",
              example: "67c99db4d704ccfd8c43657d",
            },
            completedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the quiz attempt was completed",
              example: "2025-03-07T13:48:30.909Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the quiz attempt record was created",
              example: "2025-03-07T13:48:30.914Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the quiz attempt record was last updated",
              example: "2025-03-07T13:48:30.914Z",
            },
          },
        },
        UserQuizProgressResponse: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Progress record ID",
              example: "67caf92e417a6899f2fdf893",
            },
            user: {
              type: "string",
              description: "User ID who is progressing in the course",
              example: "67c4d034e1968c13a337c8c3",
            },
            course: {
              type: "object",
              description: "Course details related to the quiz progress",
              properties: {
                _id: {
                  type: "string",
                  description: "Course ID",
                  example: "679b42460a99919e3b623a74",
                },
                title: {
                  type: "string",
                  description: "Course title",
                  example: "REST API Development",
                },
              },
            },
            topic: {
              type: "object",
              description: "Topic details related to the quiz progress",
              properties: {
                _id: {
                  type: "string",
                  description: "Topic ID",
                  example: "679b42460a99919e3b623a76",
                },
                title: {
                  type: "string",
                  description: "Topic title",
                  example: "Introduction to REST API",
                },
              },
            },
            activityType: {
              type: "string",
              enum: ["quiz"],
              description: "Type of activity recorded",
              example: "quiz",
            },
            activityTable: {
              type: "string",
              description: "The table in the database where the activity is recorded",
              example: "quizzes",
            },
            activityId: {
              type: "string",
              nullable: true, 
              description: "ID of the quiz that was attempted (null if no specific quiz is linked)",
              example: null,
            },
            completedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the quiz progress was recorded",
              example: "2025-03-07T13:48:30.909Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the progress record was created",
              example: "2025-03-07T13:48:30.914Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the progress record was last updated",
              example: "2025-03-07T13:48:30.914Z",
            },
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
