const express = require("express");
const say = require("say"); // Local TTS package
const fs = require("fs");
const path = require("path");

const router = express.Router();

// GET /api/tts?text=Hello&voice=alloy
router.get("/", async (req, res) => {
  try {
    const text = req.query.text;
    const voice = req.query.voice || null; // 'alloy' or default

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Temporary file path
    const filePath = path.join(__dirname, "tts-output.wav");

    // Use say to generate speech
    say.export(text, voice, 1.0, filePath, (err) => {
      if (err) {
        console.error("TTS error:", err);
        return res.status(500).json({ error: "Failed to generate TTS audio" });
      }

      // Send audio file for download/play
      res.set({
        "Content-Type": "audio/wav",
        "Content-Disposition": `attachment; filename="tts.wav"`,
      });

      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);

      // Delete file after sending
      readStream.on("close", () => {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting temp TTS file:", err);
        });
      });
    });
  } catch (error) {
    console.error("TTS error:", error);
    res.status(500).json({ error: "Failed to generate TTS audio" });
  }
});

module.exports = router;
