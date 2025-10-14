const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// compute tone (sentiment) score (-inf..+inf)
function computeToneScore(text) {
  if (!text) return 0;
  const { score } = sentiment.analyze(text);
  return score; // negative => negative tone, positive => positive
}

// compute typing speed in chars/sec, given typedDurationMs (ms) and message text
function computeCharsPerSec(text, typedDurationMs) {
  if (!typedDurationMs || typedDurationMs <= 0) return null;
  const chars = text ? text.length : 0;
  const secs = typedDurationMs / 1000;
  if (secs <= 0) return null;
  return chars / secs;
}

// estimate frustration from typing speed & tone
function estimateFrustration({ toneScore, charsPerSec }) {
  // baseline: neutral frustration 0
  let f = 0;

  // tone: more negative sentiment => increase frustration
  // toneScore usually small ints; scale it.
  if (toneScore < 0) f += Math.min(10, Math.abs(toneScore) * 1.5);

  // typing speed heuristics:
  // super-fast short bursts may indicate anger/impulsivity; super slow may indicate hesitation/confusion
  if (charsPerSec !== null) {
    if (charsPerSec > 6) f += 5;     // very fast typing
    else if (charsPerSec > 3) f += 2; // moderately fast
    else if (charsPerSec < 0.5) f += 3; // extremely slow -> confusion
  }

  // clamp 0..100
  if (f < 0) f = 0;
  if (f > 100) f = 100;
  return f;
}

module.exports = { computeToneScore, computeCharsPerSec, estimateFrustration };
