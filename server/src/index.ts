import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clanRoutes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: false, 
  })
);

app.use(express.json());

app.use("/api", clanRoutes);

// Sample API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
