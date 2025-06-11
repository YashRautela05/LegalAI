import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import documentRoutes from "./routes/document.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON request body
app.use(express.json());

// Define authentication routes
app.use("/auth", authRoutes);

// Define user routes
app.use("/user", userRoutes);
app.use("/document", documentRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
