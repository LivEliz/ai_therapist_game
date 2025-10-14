// src/controllers/sanityController.js
const { handleUserMessage, handleAIMessage, realityCheck, calmMode, getSessionSanity } = require('../services/sanityService');
const { validateString, validateBoolean } = require('../utils/validators');

async function postUserMessage(req, res) {
  try {
    const { sessionId, text, typedDurationMs } = req.body;
    const v = validateString(sessionId, 'sessionId') || validateString(text, 'text');
    if (v) return res.status(400).json({ error: v });

    const result = await handleUserMessage({ sessionId, text, typedDurationMs });
    // result must contain sessionId, sanity, delta, gaslightScore, toneScore, charsPerSec
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
}

async function postAIMessage(req, res) {
  try {
    const { sessionId, text, aiRealityFlag } = req.body;
    const v = validateString(sessionId, 'sessionId') || validateString(text, 'text');
    if (v) return res.status(400).json({ error: v });

    const session = await handleAIMessage({ sessionId, text, aiRealityFlag });
    return res.json({ ok: true, sanity: session.sanity });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
}

async function getSanity(req, res) {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.status(400).json({ error: 'sessionId query param required' });
    const sanity = await getSessionSanity(sessionId);
    return res.json({ sessionId, sanity });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
}

async function postRealityCheck(req, res) {
  try {
    const { sessionId, playerThinksTrue } = req.body;
    const v = validateString(sessionId, 'sessionId') || validateBoolean(playerThinksTrue, 'playerThinksTrue');
    if (v) return res.status(400).json({ error: v });

    const result = await realityCheck({ sessionId, playerThinksTrue });
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
}

async function postCalmMode(req, res) {
  try {
    const { sessionId } = req.body;
    const v = validateString(sessionId, 'sessionId');
    if (v) return res.status(400).json({ error: v });

    const result = await calmMode({ sessionId });
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
}

module.exports = { postUserMessage, postAIMessage, getSanity, postRealityCheck, postCalmMode };
