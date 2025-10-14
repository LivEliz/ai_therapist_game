import axios from "axios";

async function testChat() {
  const response = await axios.post("http://localhost:5000/api/chat", {
    userId: "user123",
    message: "How do I improve my mood?",
    persona: "polite-liar"
  });
  console.log(response.data);
}

testChat();
