const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require('path');

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [{ text: message }],
                        role: "user",
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        res.json({ reply });
    } catch (error) {
        console.error("Gemini API Error:", error?.response?.data || error.message);
        res.status(500).json({ error: "Gemini API error" });
    }
});


const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// app.use(express.static(path.join(__dirname, "../frontend/dist")))

// app.get("*", (req, res) => {
//     res.sendFile(
//         path.join(__dirname, "../frontend/dist/index.html"),

//         function (err) {
//             res.status(500).send(err)
//         }
//     )
// })