// src/services/sanityService.js
require('dotenv').config();
const Session = require('../models/sessionModel'); // mongoose model (see earlier model code)
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const MAX_SANITY = parseInt(process.env.MAX_SANITY || '100', 10);
const MIN_SANITY = parseInt(process.env.MIN_SANITY || '0', 10);
const CALM_BOOST = parseInt(process.env.CALM_MODE_BOOST || '15', 10);
const CALM_COOLDOWN_S = parseInt(process.env.CALM_MODE_COOLDOWN_S || '30', 10);

// In-memory fallback
const memoryStore = new Map();

async function upsertSession(sessionId) {
  // Try mongoose first
  if (Session && Session.findOne) {
    try {
      let s = await Session.findOne({ sessionId });
      if (!s) {
        s = new Session({ sessionId, sanity: MAX_SANITY, history: [] });
        await s.save();
      }
      return s;
    } catch (e) {
      // DB error -> fall back to memory
      console.warn('Mongo error, using in-memory store:', e.message);
    }
  }

  // Memory fallback
  if (!memoryStore.has(sessionId)) {
    memoryStore.set(sessionId, { sessionId, sanity: MAX_SANITY, history: [], lastCalmAt: null });
  }
  return memoryStore.get(sessionId);
}

function saveSession(session) {
  if (session.save) return session.save(); // mongoose doc
  memoryStore.set(session.sessionId, session);
  return Promise.resolve(session);
}

function computeToneScore(text) {
  if (!text) return 0;
  const { score } = sentiment.analyze(text);
  return score;
}

function computeCharsPerSec(text, typedDurationMs) {
  if (!typedDurationMs || typedDurationMs <= 0) return null;
  const chars = text ? text.length : 0;
  const secs = typedDurationMs / 1000;
  if (secs <= 0) return null;
  return +(chars / secs).toFixed(2);
}

function estimateFrustration({ toneScore, charsPerSec }) {
  let f = 0;
  if (typeof toneScore === 'number' && toneScore < 0) f += Math.min(100, Math.abs(toneScore) * 2);
  if (typeof charsPerSec === 'number') {
    if (charsPerSec > 6) f += 10;
    else if (charsPerSec > 3) f += 4;
    else if (charsPerSec < 0.5) f += 3;
  }
  if (f > 100) f = 100;
  return Math.round(f);
}

// 1) handle user message: returns sessionId, sanity, delta, gaslightScore, toneScore, charsPerSec
async function handleUserMessage({ sessionId, text, typedDurationMs }) {
  const session = await upsertSession(sessionId);

  const toneScore = computeToneScore(text);
  const charsPerSec = computeCharsPerSec(text, typedDurationMs);
  const frustration = estimateFrustration({ toneScore, charsPerSec });

  // map frustration (0..100) -> sanity delta (0..-25)
  const delta = - Math.round((frustration / 100) * 25);

  // store user message to history
  session.history.push({
    sender: 'user',
    text,
    timestamp: Date.now(),
    typedDurationMs,
    toneScore
  });

  // update sanity
  session.sanity = Math.max(MIN_SANITY, Math.min(MAX_SANITY, (session.sanity || MAX_SANITY) + delta));
  await saveSession(session);

  const gaslightScore = frustration; // exposed for UI

  return {
    sessionId: session.sessionId,
    sanity: session.sanity,
    delta,
    gaslightScore,
    toneScore,
    charsPerSec
  };
}

// 2) handle AI message storage
async function handleAIMessage({ sessionId, text, aiRealityFlag = null }) {
  const session = await upsertSession(sessionId);
  session.history.push({
    sender: 'ai',
    text,
    timestamp: Date.now(),
    aiRealityFlag
  });
  await saveSession(session);
  return session;
}

// 3) get session sanity
async function getSessionSanity(sessionId) {
  const s = await upsertSession(sessionId);
  return s.sanity || MAX_SANITY;
}

// 4) reality-check
async function realityCheck({ sessionId, playerThinksTrue }) {
  const session = await upsertSession(sessionId);

  // find last AI message with aiRealityFlag not null
  const lastAI = [...(session.history || [])].reverse().find(m => m.sender === 'ai' && typeof m.aiRealityFlag !== 'undefined' && m.aiRealityFlag !== null);

  if (!lastAI) {
    // fallback: small penalty/unknown
    const fallbackDelta = -2;
    session.sanity = Math.max(MIN_SANITY, session.sanity + fallbackDelta);
    await saveSession(session);
    return { result: 'unknown', sanity: session.sanity, delta: fallbackDelta, message: 'No verifiable AI statement found (demo fallback).' };
  }

  const correct = (playerThinksTrue === Boolean(lastAI.aiRealityFlag));
  const delta = correct ? +5 : -10;
  session.sanity = Math.max(MIN_SANITY, Math.min(MAX_SANITY, session.sanity + delta));
  await saveSession(session);

  return { result: correct ? 'correct' : 'incorrect', sanity: session.sanity, delta, aiStatement: lastAI.text, aiRealityFlag: lastAI.aiRealityFlag };
}

// 5) calm mode
async function calmMode({ sessionId }) {
  const session = await upsertSession(sessionId);
  const now = Date.now();
  if (session.lastCalmAt) {
    const elapsed = (now - session.lastCalmAt) / 1000;
    if (elapsed < CALM_COOLDOWN_S) {
      return { allowed: false, reason: 'cooldown', secondsLeft: Math.ceil(CALM_COOLDOWN_S - elapsed), sanity: session.sanity };
    }
  }
  session.sanity = Math.min(MAX_SANITY, session.sanity + CALM_BOOST);
  session.lastCalmAt = now;
  await saveSession(session);
  return { allowed: true, sanity: session.sanity, boost: CALM_BOOST };
}

module.exports = { handleUserMessage, handleAIMessage, realityCheck, calmMode, getSessionSanity };
