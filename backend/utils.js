export function computeGaslightScore(aiReply) {
  let score = 0;
  const markers = ["you always", "you never", "are you sure", "remember when", "that never happened"];
  const text = aiReply.toLowerCase();
  markers.forEach((m) => {
    if (text.includes(m)) score += 2;
  });
  if (aiReply.length < 40) score += 1;
  return Math.min(10, score);
}
