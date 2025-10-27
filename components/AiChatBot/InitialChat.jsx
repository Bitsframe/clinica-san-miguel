"use client";
import "./Chat.css";
import React, { useEffect } from "react";
import Arrow from "../../assets/images/AiBot/arrow.png";
import Aibot from "../../assets/images/AiBot/model.png";
import RightArrow from "../../assets/images/AiBot/rightArrow.png";
import aiProfile from "../../assets/images/AiBot/aiProfile.png";
import Image from "next/image";
import { BotContext } from "@/context/Context";
import { useContext } from "react";

const InitialChat = (props) => {
  const createThreadRequest = async () => {
    try {
      const response = await fetch("/api/thread/create", {
        method: "POST",
      });
      const data = await response.json();
      return data.id;
    } catch (error) {
      throw new Error("Failed to create thread");
    }
  };
  const loaderClickHandler = async () => {
    props.initialChatHandler();
    const assistantId = "asst_rsujDworTj9GbbUdX9Iu7qUk";
    const threadId = await createThreadRequest();
    props.updateIDsState(assistantId, threadId);
  };

  return (
    <div
      className={`relative  bg-gradient-to-b from-red-800 bg-[#000000] h-[700px] w-[361px] rounded-2xl flex flex-col justify-start items-center font-poppinsRegular  animate__animated  animate__fadeInUp
      }    `}
    >
      <Image
        src={Aibot}
        alt="Ai Bot"
        height={250}
        width={250}
        className="mt-10"
      />
      <h1 className="text-white text-[28px] font-bold">
        Clinic San Miguel AI Bot
      </h1>
      <p className="text-xs text-left text-white px-6">
        Here you can ask any question, query related to san miguel clinics.
      </p>

      <div className="mt-5 w-[87%] flex items-center justify-between">
        <div>
          <span>&nbsp;</span>
        </div>

        <div className="loader">
          <div className="loader-container">
            <button onClick={loaderClickHandler}>
              <div className="flex bg-white items-center justify-center p-4 rounded-[100px] relative"></div>
            </button>
          </div>
        </div>
      </div>

      {/* <div className="flex items-center justify-center rounded-bl-lg rounded-br-lg py-1 font-bold text-black  bg-[#EBF0F4] text-[11px] ">
        Powered by MyclinicMD
      </div> */}
    </div>
  );
};

export default InitialChat;
