import mongoose from "mongoose";
import dotenvFlow from "dotenv-flow";
import Course from "../models/Course";
import Topic from "../models/Topic";
import Quiz from "../models/Quiz";
import User from "../models/User";

// Load environment variables
dotenvFlow.config();

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI as string;

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Topic.deleteMany({});
    await Course.deleteMany({});
    await Quiz.deleteMany({});

    console.log("🗑️ Existing data cleared");

    const adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: "admin1234",
      role: "admin",
    });

    console.log(`👤 Created admin user: ${adminUser.username}`);

    const course = await Course.create({
      title: "REST API Fundamentals",
      description: "Introductory course to REST APIs.",
      teacher: adminUser._id,
      scope: "5 ECTS",
      semester: "1st Semester",
      learningObjectives: ["Understand what REST APIs are"],
      skills: ["Define and explain REST", "Use HTTP methods"],
      competencies: ["Apply REST principles"],
    });

    const topic = await Topic.create({
      title: "REST Basics",
      week: 1,
      summary: "Foundational knowledge of REST.",
      key_points: ["REST definition", "HTTP methods", "Statelessness"],
      resources: [
        {
          title: "REST on MDN",
          link: "https://developer.mozilla.org/en-US/docs/Web/HTTP/REST",
        },
      ],
      course: course._id,
    });

    const quizzes = await Quiz.insertMany([
      {
        question: "What does REST stand for?",
        topic: topic._id,
        options: [
          { text: "Rapid Execution System Task", isCorrect: false, order: 1 },
          {
            text: "Representational State Transfer",
            isCorrect: true,
            order: 2,
          },
          { text: "Remote Exchange Secure Token", isCorrect: false, order: 3 },
          { text: "Read Execute Store Transfer", isCorrect: false, order: 4 },
        ],
      },
      {
        question: "Which HTTP method retrieves data?",
        topic: topic._id,
        options: [
          { text: "POST", isCorrect: false, order: 1 },
          { text: "GET", isCorrect: true, order: 2 },
          { text: "PUT", isCorrect: false, order: 3 },
          { text: "DELETE", isCorrect: false, order: 4 },
        ],
      },
      {
        question: "Which is a core REST principle?",
        topic: topic._id,
        options: [
          { text: "Stateful communication", isCorrect: false, order: 1 },
          { text: "Statelessness", isCorrect: true, order: 2 },
          { text: "SOAP encoding", isCorrect: false, order: 3 },
          { text: "Session tracking", isCorrect: false, order: 4 },
        ],
      },
      {
        question: "Which status code means OK?",
        topic: topic._id,
        options: [
          { text: "404", isCorrect: false, order: 1 },
          { text: "200", isCorrect: true, order: 2 },
          { text: "500", isCorrect: false, order: 3 },
          { text: "301", isCorrect: false, order: 4 },
        ],
      },
      {
        question: "Which tool can test REST APIs?",
        topic: topic._id,
        options: [
          { text: "Photoshop", isCorrect: false, order: 1 },
          { text: "Postman", isCorrect: true, order: 2 },
          { text: "Excel", isCorrect: false, order: 3 },
          { text: "Chrome DevTools", isCorrect: false, order: 4 },
        ],
      },
    ]);

    console.log(`📚 Created Course: ${course.title}`);
    console.log(`📖 Created Topic: ${topic.title}`);
    console.log(
      `📝 Created ${quizzes.length} Quizzes for Topic: ${topic.title}`
    );
    console.log("✅ Course, Topic and Quizzes Seeded Successfully!");
    mongoose.connection.close();
    console.log("🔌 MongoDB Connection Closed");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    mongoose.connection.close();
  }
}

// ✅ Run the seed function

export default seedDatabase;
