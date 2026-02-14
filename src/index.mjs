import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import verifyToken from "./middleware/verifyToken.js";
import eventRoutes from "./routes/eventRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";



connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", (req, res, next) => {
  req.io = io;
  next();
}, eventRoutes);


app.get("/", (req, res) => {
  res.send("API Running 🚀");
});
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});

const PORT = process.env.PORT || 5000;

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

