"use client";
// import "regenerator-runtime/runtime";
import Image from "next/image";
import { useState } from "react";
import ChatInterface from "./Chat";
import InitialChat from "./InitialChat";
import AiBot from "../../assets/images/AiBot/Aibot.png";
import "animate.css";
export default function AiBotMain() {
  const [open, setOpen] = useState(false);
  const [initialModal, setInitialModal] = useState(true);
  const [assistantId, setAssistantId] = useState("");
  const [threadId, setThreadId] = useState("");

  const openClickHandler = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const initialChatHandler = () => {
    setInitialModal((initialModal) => !initialModal);
  };

  const updateIDsState = (newAssistantId: any, newThreadId: any) => {
    setAssistantId(newAssistantId);
    setThreadId(newThreadId);
  };

  return (
    <div className="relative">
      <div className="absolute w-[350px] bottom-20 right-4 md:right-8">
        {open && [
          initialModal ? (
            <InitialChat
              key="initialChat"
              initialChatHandler={initialChatHandler}
              updateIDsState={updateIDsState}
            />
          ) : (
            <ChatInterface
              key="chatInterface"
              assistantId={assistantId}
              threadId={threadId}
            />
          ),
        ]}
      </div>

      <div className="flex flex-col items-center justify-center fixed bottom-1 right-4 ">
        <div className="w-[351px] flex items-center my-2 justify-end">
          <div
            className="flex items-center  cursor-pointer justify-center bg-red-700 p-3 rounded-[50px]"
            onClick={openClickHandler}
          >
            <Image
              src={AiBot}
              className="cursor-pointer h-[40px] w-[40px]"
              alt="Ai Chat Bot"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
