import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const VoiceAssistant = () => {
  const [aiResponse, setAiResponse] = useState("");
  const { transcript, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Your browser does not support Speech Recognition.</p>;
  }

  const handleAsk = async () => {
    if (!transcript) return;

    try {
      // Call your backend AI endpoint
      const response = await fetch("http://localhost:4000/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: transcript }),
      });

      const data = await response.json();
      setAiResponse(data.answer || "Sorry, no answer found.");

      // Speak the answer
      const utterance = new SpeechSynthesisUtterance(data.answer || "Sorry, no answer found.");
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);

      resetTranscript();
    } catch (err) {
      console.error(err);
      alert("AI request failed.");
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      <button
        onClick={() => SpeechRecognition.startListening({ continuous: true })}
        style={{ marginRight: 10 }}
      >
        🎤 Start Listening
      </button>
      <button onClick={() => SpeechRecognition.stopListening()} style={{ marginRight: 10 }}>
        🛑 Stop
      </button>
      <button onClick={handleAsk}>💬 Ask AI</button>

      <div style={{ marginTop: 10, background: "#eee", padding: 10, borderRadius: 8 }}>
        <p><strong>You said:</strong> {transcript}</p>
        <p><strong>AI says:</strong> {aiResponse}</p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
