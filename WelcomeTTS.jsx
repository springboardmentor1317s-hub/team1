import { useEffect, useRef } from "react";

const WelcomeTTS = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    const playWelcome = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/tts?text=Welcome to Campus Event Hub"
        );
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        audioRef.current.src = url;
        audioRef.current.play();
      } catch (err) {
        console.error("TTS error", err);
      }
    };

    playWelcome();
  }, []);

  return <audio ref={audioRef} style={{ display: "none" }} />;
};

export default WelcomeTTS;
