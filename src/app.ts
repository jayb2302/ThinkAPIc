import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import cors from "cors";
import { connectDB } from "./config/database";
import routes from "./routes";
import { setupDocs } from "./swagger";

dotenvFlow.config();

// Create Express Application
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow Frontend access
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api", routes);

export function startServer() {
  // Connect to MongoDB
  connectDB();

  // Setup Swagger Docs
  setupDocs(app);

  // Start Server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, function () {
    console.log(`🚀 ThinkAPIc Server is running on port ${PORT}`);
  });
}
