import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import cors from "cors";
import { connectDB } from "./config/database";
import routes from "./routes";
import { setupDocs } from "./swagger";
import { errorHandler } from "./utils/errorHandlers";
import path from "path";

dotenvFlow.config();

// Create Express Application
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Allow Frontend access
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api", routes);

// Error Handler
app.use(errorHandler);

export async function startServer() {
  try {
    await connectDB();

    // Setup Swagger Docs
    setupDocs(app);

    // Start Server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, function () {
      console.log(`🚀 ThinkAPIc Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
}
