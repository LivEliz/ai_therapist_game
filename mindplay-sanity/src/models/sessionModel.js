const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user','ai'], required: true },
  text: String,
  timestamp: { type: Date, default: Date.now },
  // optional fields for demo
  typedDurationMs: Number, // how long user took to type
  toneScore: Number,       // sentiment score
  aiRealityFlag: { type: Boolean, default: null } // if AI's last message had an assigned 'truth' flag
});

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  sanity: { type: Number, default: 100 },
  history: [messageSchema],
  lastCalmAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
