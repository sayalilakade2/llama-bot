import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

// Root route
app.get("/", (req, res) => {
  res.send("✅ Llama Bot Server is running!");
});

// Chat route
app.post("/message", async (req, res) => {
  const userMessage = req.body.message;

  // Dummy Llama 3 response (replace later with actual model call)
  const botReply = `Llama 3 says: You said "${userMessage}"`;

  res.json({ reply: botReply });
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server running on port 3000");
});
