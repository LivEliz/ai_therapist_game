// src/SanityBar.js
import React from "react";

function SanityBar({ sanity }) {
  return (
    <div style={{ width: "60%", margin: "20px auto" }}>
      <h3>Sanity Points: {sanity}</h3>
      <div style={{ background: "#333", height: "20px", borderRadius: "10px" }}>
        <div
          style={{
            height: "20px",
            width: `${sanity}%`,
            background: sanity > 50 ? "#4caf50" : sanity > 20 ? "#ff9800" : "#f44336",
            borderRadius: "10px",
            transition: "width 0.3s ease",
          }}
        ></div>
      </div>
    </div>
  );
}

export default SanityBar;
