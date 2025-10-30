import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Base route
app.get("/", (req, res) => {
  res.send({ message: "Llama Bot is live 🚀" });
});

// ✅ Route for Zoho Cliq
app.post("/cliqbot", async (req, res) => {
  console.log("Incoming from Zoho:", req.body);

  // Zoho Cliq sends "text" not "message"
  const userMessage = req.body.text || req.body.message || "";

  if (!userMessage) {
    return res.json({ text: "Llama 3 says: You said 'undefined'" });
  }

  try {
    // Call Hugging Face Llama 3 model
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${process.env.MODEL_ID}`,
      { inputs: userMessage },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract reply
    let botReply = "Sorry, I couldn’t get a response.";
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      botReply = response.data[0].generated_text;
    } else if (response.data.generated_text) {
      botReply = response.data.generated_text;
    }

    // ✅ Return response in Zoho format
    return res.json({
      text: `Llama 3 says: ${botReply}`,
    });
  } catch (error) {
    console.error("Error contacting Llama API:", error.message);
    return res.status(500).json({ text: "Error contacting Llama API" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Llama Bot running on port ${PORT}`);
});
