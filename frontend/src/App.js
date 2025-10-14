import React, { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "👋 Welcome to MindPlay — Mind the Mood. Let's begin your therapy session..." },
  ]);
  const [input, setInput] = useState("");
  const [sanity, setSanity] = useState(100);
  const [isCalmMode, setIsCalmMode] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages([...messages, userMsg]);
    setInput("");

    const aiReplies = [
      "Hmm... interesting, but are you sure about that? 😏",
      "That's not what you said before, right? 🤨",
      "You might be overreacting, don't you think?",
      "Maybe it's not me, maybe it's you 😌",
      "I care about you… but not *that* much 💅",
    ];

    const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
    const gaslightScore = Math.floor(Math.random() * 15);

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "ai", text: randomReply }]);
      setSanity((prev) => Math.max(0, prev - gaslightScore));
    }, 800);
  };

  const activateCalmMode = () => {
    setIsCalmMode(true);
    setTimeout(() => {
      setIsCalmMode(false);
      setSanity((prev) => Math.min(100, prev + 10));
    }, 5000);
  };

  const getMoodClass = () => {
    if (sanity > 70) return "mood-calm";
    if (sanity > 40) return "mood-neutral";
    return "mood-chaotic";
  };

  return (
    <div className={`App ${getMoodClass()}`}>
      <div className="overlay"></div>

      {/* ✅ Heading added here */}
      <h1 style={{
        position: "absolute",
        top: "15px",
        width: "100%",
        textAlign: "center",
        color: "#fff",
        fontSize: "2.5rem",
        textShadow: "0 0 20px rgba(255,255,255,0.9)"
      }}>
        MindPlay
      </h1>

      <div className="chat-container">
        <h1 className="title">💫 MindPlay — Mind the Mood</h1>

        <div className="sanity-bar">
          <div className="sanity-level" style={{ width: `${sanity}%` }}></div>
        </div>
        <p className="sanity-text">Sanity: {Math.round(sanity)}%</p>

        <div className="chat-box">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="controls">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your feelings..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send 💬</button>
          <button onClick={activateCalmMode} className="calm-button">
            Calm Mode 🧘
          </button>
        </div>

        {isCalmMode && (
          <div className="calm-overlay">
            🌬️ Breathe In... Hold... Breathe Out...
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
