"use client";
import React from "react";
import UserProfile from "../../assets/images/AiBot/user.png";
import AiProfile from "../../assets/images/AiBot/aiProfile.png";
import Image from "next/image";
import { BotContext } from "@/context/Context";
import { useContext } from "react";
const ChatMessage = ({ message }) => {
  const { username } = useContext(BotContext);
  const userClass =
    message.sender === "user"
      ? " mb-4  p-3 bg-[#C1001F] text-[#475560] text-[12px]  rounded-tr-[20px] shadow-md  rounded-tl-[20px] rounded-bl-[20px]    self-end    "
      : "mb-4   p-3 bg-[#3D3D3C] rounded-br-[20px] rounded-tr-[20px] rounded-bl-[20px] max-w-md  shadow-md  text-[12px] ";

  if (!message.content) {
    return null;
  }
  return (
    <div
      className={`flex mt-4  w-[100%] items-center ${
        message.sender === "user" && "justify-end"
      }

      ${message.sender === "assistant" && "justify-start"}
      
      `}
    >
      <div
        className={`flex  animate__animated animate__fadeInUp  w-[100%] ${
          message.sender === "user" && "justify-end"
        }
      ${message.sender === "assistant" && "justify-start"}  "`}
      >
        {/* {message.sender === "assistant" && (
          <div className="flex items-center p-1 w-[20%]  flex-col ">
            <Image src={AiProfile} className="h-[35px] w-[35px]  mr-1 p-1 " />
            <p className="text-[10px] text-center">AI assistant</p>
          </div>
        )} */}
        <div className="w-[80%]">
          <div className={`${userClass} `}>
            <p className="text-[#475560] text-white  text-justify ">
              {message.content}
            </p>
          </div>
        </div>
        {/* {message.sender === "user" && (
          <div className="flex items-center p-1 w-[20%]  flex-col ">
            <Image src={UserProfile} className="h-[35px] w-[35px]  mr-1 p-1 " />
            <p className="text-[10px] text-white text-center ">{username}</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ChatMessage;
