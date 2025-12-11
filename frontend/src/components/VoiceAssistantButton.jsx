import React, { useState } from "react";

const VoiceAssistantButton = () => {
  const [listening, setListening] = useState(false);

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = async (event) => {
      const question = event.results[0][0].transcript;
      console.log("User said:", question);

      try {
        const res = await fetch(`http://localhost:4000/api/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        });
        const data = await res.json();
        const answer = data.answer || "No response.";

        const utterance = new SpeechSynthesisUtterance(answer);
        speechSynthesis.speak(utterance);

      } catch (err) {
        console.error(err);
        alert('Error getting AI response');
      }
    };

    recognition.start();
  };

  return (
    <button
      onClick={handleVoice}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        padding: "15px 20px",
        borderRadius: "50%",
        backgroundColor: "#4caf50",
        color: "#fff",
        fontWeight: "bold",
        border: "none",
        cursor: "pointer",
      }}
    >
      {listening ? "🎤 Listening..." : "🎙️ Ask"}
    </button>
  );
};

export default VoiceAssistantButton;
