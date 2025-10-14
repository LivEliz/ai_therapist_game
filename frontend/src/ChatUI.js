// src/ChatUI.js
import React, { useState } from "react";
import axios from "axios";

function ChatUI({ sanity, setSanity }) {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", { message: userInput });
      const aiReply = response.data.reply;
      const gaslightScore = response.data.gaslightScore || 0;

      // Update sanity based on gaslight
      setSanity((prev) => Math.max(0, prev - gaslightScore));

      setMessages([...newMessages, { sender: "ai", text: aiReply }]);
    } catch (err) {
      console.error("Error connecting to backend:", err);
      setMessages([...newMessages, { sender: "ai", text: "Server unavailable. Try again later." }]);
    }

    setUserInput("");
  };

  return (
    <div style={{ width: "60%", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          background: "#1e1e1e",
          padding: "15px",
          borderRadius: "10px",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: "8px 0", textAlign: msg.sender === "user" ? "right" : "left" }}>
            <span
              style={{
                background: msg.sender === "user" ? "#4a90e2" : "#333",
                padding: "10px",
                borderRadius: "10px",
                display: "inline-block",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type your message..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        style={{
          width: "80%",
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          outline: "none",
          marginRight: "10px",
        }}
      />
      <button onClick={sendMessage} style={{ padding: "10px 15px", borderRadius: "8px", cursor: "pointer" }}>
        Send
      </button>
    </div>
  );
}

export default ChatUI;
