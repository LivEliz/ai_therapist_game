// src/App.js
import React, { useState } from "react";
import "./App.css";

// Reality Check Button
const RealityCheckButton = ({ onClick }) => (
  <button className="btn reality" onClick={onClick}>
    🧠 Reality Check
  </button>
);

// Calm Mode Animation
const CalmModeAnimation = ({ active }) => {
  if (!active) return null;
  return (
    <div className="calm-container">
      <img
        src="/stickers/relax_avatar.png"
        alt="Relaxing Avatar"
        className="calm-avatar"
      />
      <div className="calm-circle"></div>
      <p className="calm-text">Inhale... Exhale... You're doing great 💫</p>
    </div>
  );
};

// Meme Modal
const MemeModal = ({ visible, memeUrl, onClose }) => {
  if (!visible) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <img
          src="/stickers/laughing_sticker.png"
          alt="Sticker"
          className="corner-sticker"
        />
        <h2>😂 Therapist Approved Meme</h2>
        <img src={memeUrl} alt="funny meme" />
      </div>
    </div>
  );
};

function App() {
  const [calmActive, setCalmActive] = useState(false);
  const [memeVisible, setMemeVisible] = useState(false);
  const [memeUrl, setMemeUrl] = useState("");
  const [persona, setPersona] = useState("toxic"); // default persona

  // Reality Check behavior based on persona
  const handleRealityCheck = () => {
    let message = "";
    if (persona === "toxic") {
      message =
        "💔 Toxic Ex says: Oh really? You think you can handle life? Good luck. 💀";
    } else if (persona === "sarcastic") {
      message =
        "😏 Sarcastic Mode says: Wow, amazing! Another deep thought. 🙄";
    } else {
      message = "🌍 Take a deep breath. You're real, the world’s real. Probably.";
    }
    alert(message);
  };

  const toggleCalmMode = () => setCalmActive(!calmActive);

  const showMeme = () => {
    const memes = [
      "https://i.imgflip.com/7k7u2k.jpg",
      "https://i.imgflip.com/6tsp20.jpg",
      "https://i.imgflip.com/7t3x6h.jpg",
      "https://i.imgflip.com/6z0zjh.jpg",
    ];
    setMemeUrl(memes[Math.floor(Math.random() * memes.length)]);
    setMemeVisible(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Header Mascot */}
        <div className="header-title">
          <img
            src="/stickers/therapist_brain.png"
            alt="Therapist Brain"
            className="mascot"
          />
          <h1 className="app-title">🤖 AI Therapist</h1>
        </div>

        <p className="subtitle">
          “Where mental health meets memes and mindfulness.” 🌈
        </p>

        {/* Persona Selector */}
        <div className="persona-selector">
          <button
            className={`persona-btn ${persona === "toxic" ? "active" : ""}`}
            onClick={() => setPersona("toxic")}
          >
            💔 Toxic Ex
          </button>
          <button
            className={`persona-btn ${persona === "sarcastic" ? "active" : ""}`}
            onClick={() => setPersona("sarcastic")}
          >
            😏 Sarcastic Mode
          </button>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <RealityCheckButton onClick={handleRealityCheck} />
          <button className="btn calm" onClick={toggleCalmMode}>
            {calmActive ? "🛑 Stop Calm Mode" : "🌿 Start Calm Mode"}
          </button>
          <button className="btn meme" onClick={showMeme}>
            😂 Meme Time
          </button>
        </div>

        {/* Calm Mode Animation */}
        <CalmModeAnimation active={calmActive} />

        {/* Meme Modal */}
        <MemeModal
          visible={memeVisible}
          memeUrl={memeUrl}
          onClose={() => setMemeVisible(false)}
        />
      </header>
    </div>
  );
}

export default App;
