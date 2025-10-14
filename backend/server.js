import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import { personas } from "./personas.js";
import { computeGaslightScore } from "./utils.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mindplay";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

const chatSchema = new mongoose.Schema({
  userId: String,
  userMessage: String,
  aiReply: String,
  persona: String,
  gaslightScore: Number,
  createdAt: { type: Date, default: Date.now }
});
const Chat = mongoose.model("Chat", chatSchema);

app.post("/api/chat", async (req, res) => {
  const { userId = "guest", message, persona = "toxic-ex" } = req.body;

  if (!message) return res.status(400).json({ error: "Message required" });

  // ----- MOCK RESPONSE -----
  const aiReply = `(${persona}) AI mock reply to: "${message}"`;
  const gaslightScore = Math.floor(Math.random() * 10) + 1;

  // Save to MongoDB
  const chat = new Chat({ userId, userMessage: message, aiReply, persona, gaslightScore });
  await chat.save();

  res.json({ aiReply, gaslightScore, persona });
});


// Test route
app.get("/", (req, res) => res.send("MindPlay backend running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
