// src/CalmMode.js
import React, { useState } from "react";
import axios from "axios";

function CalmMode({ setSanity }) {
  const [isBreathing, setIsBreathing] = useState(false);

  const startCalmMode = async () => {
    setIsBreathing(true);
    setTimeout(async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/calm-mode");
        const bonus = response.data.bonus || 5;
        setSanity((prev) => Math.min(100, prev + bonus));
      } catch (err) {
        console.error("Error during calm mode:", err);
        // fallback: add small bonus locally
        setSanity((prev) => Math.min(100, prev + 3));
      }
      setIsBreathing(false);
    }, 5000);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={startCalmMode}
        disabled={isBreathing}
        style={{
          padding: "10px 20px",
          borderRadius: "10px",
          background: isBreathing ? "#aaa" : "#4caf50",
          color: "white",
          cursor: "pointer",
        }}
      >
        {isBreathing ? "Breathe..." : "Calm Mode 🌿"}
      </button>
      {isBreathing && <div style={{ marginTop: "10px", animation: "pulse 2s infinite" }}>🫁 Inhale... Exhale...</div>}
    </div>
  );
}

export default CalmMode;
