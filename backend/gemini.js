import { GoogleGenAI } from '@google/genai';
import { personas } from './personas.js';

const ai = new GoogleGenAI({});

export async function getGeminiResponse(userMessage, personaKey = 'friendly-therapist') {
  const personaPrompt = personas[personaKey] || personas['friendly-therapist'];

  // Combine persona instructions with user message
  const fullPrompt = `${personaPrompt}\n\nUser: ${userMessage}\nAI:`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: fullPrompt
  });

  const aiReply = response.text;

  // Compute frustration score (example heuristic)
  const frustrationScore = computeFrustrationScore(userMessage, aiReply);

  return { aiReply, frustrationScore };
}

// Example simple heuristic function
function computeFrustrationScore(userMessage, aiReply) {
  // Placeholder: you can customize scoring logic
  let score = 1;
  const negativeWords = ['angry', 'frustrated', 'upset', 'sad', 'hate', 'stupid'];
  negativeWords.forEach(word => {
    if (userMessage.toLowerCase().includes(word)) score++;
  });
  return Math.min(score, 10);
}
