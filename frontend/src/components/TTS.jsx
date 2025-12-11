import React, { useState } from "react";

const TTS = () => {
  const [text, setText] = useState("");

  const speak = () => {
    if (!text.trim()) {
      alert("Please enter some text");
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Text to Speech</h1>

        <textarea
          className="w-full border p-3 rounded-md h-40"
          placeholder="Type text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button
          onClick={speak}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Speak
        </button>
      </div>
    </div>
  );
};

export default TTS;
