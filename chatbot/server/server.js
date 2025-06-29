const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      { inputs: `Question: ${message} Answer:` },
      {
        headers: {
          "Content-Type": "application/json"
          // 🔥 No Authorization header here!
        }
      }
    );

    console.log("✅ HuggingFace Response:", response.data);
    const reply = response.data?.[0]?.generated_text || "No reply";
    res.json({ reply });

  } catch (err) {
    console.error("❌ HuggingFace API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch from HuggingFace" });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
