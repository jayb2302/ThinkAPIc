import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";
import Course from "../models/Course";
import Topic from "../models/Topic";

// Load environment variables
dotenvFlow.config();

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI as string;

async function seedDatabase() {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ✅ Clear existing data
    await Topic.deleteMany({});
    await Course.deleteMany({});
    console.log("🗑️ Existing data cleared");

    // ✅ Create API Course
    const apiCourse = await Course.create({
      title: "REST API Development",
      description: "The purpose of this course is to introduce and train students in REST API development, including API design, implementation, and testing.",
      teacher: "Søren Spangsberg Jørgensen",
      scope: "5 ECTS",
      semester: "2nd Semester",
      learningObjectives: [
        "Understand API and REST API concepts",
        "Learn how REST APIs fit into web development",
        "Understand HTTP methods, requests, and responses",
        "Design and document APIs using OpenAPI (Swagger)"
      ],
      skills: [
        "Design and implement REST APIs",
        "Query data from a REST API",
        "Secure and test a REST API",
        "Deploy an API to a cloud platform"
      ],
      competencies: [
        "Choose a suitable tech stack for REST API development",
        "Apply knowledge and skills to real-world API solutions",
        "Collaborate in REST API development",
        "Optimize API performance and security"
      ],
    });

    console.log(`📚 Created Course: ${apiCourse.title}`);

    // ✅ Insert Topics & Collect their IDs
    const topics = await Topic.insertMany([
      {
        title: "Introduction to REST API",
        week: 5,
        summary: "Understanding REST APIs and their role in web development.",
        key_points: [
          "What is an API?",
          "What is REST and why is it important?",
          "The Six REST Constraints",
          "Exploring Public REST APIs",
        ],
        resources: [
          {
            title: "REST API Basics - MDN",
            link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/REST",
          },
        ],
        course: apiCourse._id,
      },
      {
        title: "HTTP Methods & CRUD Operations",
        week: 6,
        summary: "Understanding GET, POST, PUT, DELETE and HTTP status codes.",
        key_points: [
          "GET retrieves data from the server.",
          "POST creates new data.",
          "PUT updates existing data.",
          "DELETE removes data from the server.",
          "Common HTTP status codes (200, 201, 400, 404, 500)",
        ],
        resources: [
          {
            title: "HTTP Methods - MDN",
            link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods",
          },
        ],
        course: apiCourse._id,
      },
      {
        title: "User Authentication & JWT",
        week: 8,
        summary: "Securing your API using JSON Web Tokens (JWT).",
        key_points: [
          "What is JWT?",
          "How to implement user authentication",
          "Protecting routes with JWT",
          "Testing authentication with Postman",
        ],
        resources: [
          {
            title: "JWT Authentication Guide",
            link: "https://jwt.io/introduction/",
          },
        ],
        course: apiCourse._id,
      },
      {
        title: "API Documentation with Swagger",
        week: 9,
        summary: "Documenting and testing APIs using Swagger.",
        key_points: [
          "What is Swagger?",
          "Generating API documentation",
          "Testing API endpoints using Swagger UI",
        ],
        resources: [
          { title: "Swagger Documentation", link: "https://swagger.io/" },
        ],
        course: apiCourse._id,
      },
      {
        title: "GraphQL Introduction",
        week: 9,
        summary: "Understanding the differences between REST and GraphQL.",
        key_points: [
          "What is GraphQL?",
          "Differences between REST and GraphQL",
          "Querying data using GraphQL",
        ],
        resources: [
          { title: "GraphQL Basics", link: "https://graphql.org/learn/" },
        ],
        course: apiCourse._id,
      },
      {
        title: "Final API Presentation & Recap",
        week: 10,
        summary: "Presenting your API project and reviewing key concepts.",
        key_points: [
          "Showcasing the API features",
          "Discussing challenges and solutions",
          "Finalizing API deployment",
        ],
        resources: [],
        course: apiCourse._id,
      },
    ]);

    console.log("✅ Topics Seeded Successfully!");

    // ✅ Update Course with Topics
    await Course.findByIdAndUpdate(apiCourse._id, {
      $set: { topics: topics.map(topic => topic._id) }
    });

    console.log(`📚 Updated Course with Topics: ${apiCourse.title}`);

    // ✅ Close the connection
    mongoose.connection.close();
    console.log("🔌 MongoDB Connection Closed");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    mongoose.connection.close();
  }
}

// ✅ Run the seed function
seedDatabase();