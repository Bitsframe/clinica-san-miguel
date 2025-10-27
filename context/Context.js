"use client";

import "regenerator-runtime/runtime";
import { createContext, useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
export const BotContext = createContext();

export default function BotProvider({ children }) {
  const [modal, setModal] = useState("");
  const [username, setUsername] = useState("");
  const [_message, setMessage] = useState("");
  const [language, setLanguage] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };
  const stopListening = async () => {
    await SpeechRecognition.stopListening();
    resetTranscript();
    await handleVoice();
  };
  const handleVoice = async () => {
    if (!transcript) {
      return;
    }

    const userMessage = { text: transcript, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("http://64.23.151.134:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: transcript }),
      });

      const { answer } = await response.json();

      const botMessage = { text: answer.answer, sender: "bot" };

      let speech = new SpeechSynthesisUtterance();
      speech.text = answer.answer;
      window.speechSynthesis.speak(speech);

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }
    setPrompt("");
  };

  return (
    <BotContext.Provider
      value={{
        startListening,
        transcript,
        stopListening,
        listening,
        username,
        setUsername,
        modal,
        setModal,
        language,
        setLanguage,
      }}
    >
      {children}
    </BotContext.Provider>
  );
}
