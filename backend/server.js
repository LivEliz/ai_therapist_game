import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { getGeminiResponse } from './gemini.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mindplay';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error(err));

const chatSchema = new mongoose.Schema({
  userId: String,
  userMessage: String,
  aiReply: String,
  persona: String,
  gaslightScore: Number,
  createdAt: { type: Date, default: Date.now }
});
const Chat = mongoose.model('Chat', chatSchema);

app.post('/api/chat', async (req, res) => {
  const { userId = 'guest', message, persona = 'friendly-therapist' } = req.body;

  if (!message) return res.status(400).json({ error: 'Message required' });

  const { aiReply, frustrationScore } = await getGeminiResponse(message, persona);

  const chat = new Chat({
    userId,
    userMessage: message,
    aiReply,
    persona,
    gaslightScore: frustrationScore
  });
  await chat.save();

  res.json({ aiReply, gaslightScore: frustrationScore, persona });
});

// Test route
app.get('/', (req, res) => res.send('MindPlay backend running 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
