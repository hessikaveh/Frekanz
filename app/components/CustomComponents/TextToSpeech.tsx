import React, { useState, useEffect } from "react";

interface TextToSpeechProps {
  text: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text }) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de";
    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [text]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
    }

    if (utterance) {
      synth.speak(utterance);
    }

    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;

    synth.pause();

    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;

    synth.cancel();

    setIsPaused(false);
  };

  return (
    <div className="flex justify-center">
      <button className="btn btn-xs mx-1" onClick={handlePlay}>
        {isPaused ? "⏯️" : "▶️"}
      </button>
      <button className="btn btn-xs btn-circle" onClick={handlePause}>
        ⏸️
      </button>
      <button className="btn btn-xs btn-circle" onClick={handleStop}>
        ⏹️
      </button>
    </div>
  );
};

export default TextToSpeech;
