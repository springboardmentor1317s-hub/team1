import React, { useState } from "react";

export default function TTSPage() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const speakText = async () => {
    if (!text.trim()) {
      alert("Please type something!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/tts?text=${encodeURIComponent(text)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate audio");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Text to Speech</h1>

      <textarea
        rows="5"
        style={{ width: "300px" }}
        placeholder="Enter text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <br />
      <button onClick={speakText} style={{ marginTop: "10px", padding: "10px" }}>
        Speak
      </button>

      {audioUrl && (
        <audio
          controls
          autoPlay
          src={audioUrl}
          style={{ display: "block", marginTop: "20px" }}
        ></audio>
      )}
    </div>
  );
}
