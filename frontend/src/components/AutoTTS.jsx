import { useEffect } from "react";

const AutoTTS = ({ text }) => {
  useEffect(() => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel(); // Stop if component unmounts
    };
  }, [text]);

  return null; // No UI element needed
};

export default AutoTTS;
