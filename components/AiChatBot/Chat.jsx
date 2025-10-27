"use client";
import React, { use } from "react";
import axios from "axios";
import Arrow from "../../assets/images/AiBot/arrow.png";
import responseWait from "../../assets/images/AiBot/response-wait.png";
import sendArrow from "../../assets/images/AiBot/send_arrow.png";
import User from "../../assets/images/AiBot/user.png";
import Microphone from "../../assets/images/AiBot/microphone2.png";
import aiProfile from "../../assets/images/AiBot/aiProfile.png";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { BotContext } from "@/context/Context";
import { useContext } from "react";
const ChatInterface = (props) => {
  const bottomRef = useRef(null);

  const [prompt, setPrompt] = useState("");
  const [assistantActive, setAssistantActive] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  let userMessage = "";
  let botMessage = "";
  let botId;

  const assistantActiveHandler = () => {
    setAssistantActive((assistantActive) => !assistantActive);
  };

  const {
    startListening,
    transcript,
    stopListening,
    listening,
    modal,
    username,
  } = useContext(BotContext);

  const commonMessages = [
    {
      text: "How much is office visit?",
    },
    {
      text: "What do I get for $19? ",
    },
    {
      text: "Are you open on Sundays? ",
    },
  ];

  const createChat = () => {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2);

    const newUserMessage = {
      id: timestamp + randomString,
      sender: "user",
      content: userMessage,
    };

    const newBotMessage = {
      id: botId,
      sender: "assistant",
      content: botMessage,
    };

    // Update the state of chatMessages by appending both user and bot messages
    setChatMessages((prevMessages) => [
      ...prevMessages,
      newUserMessage,
      newBotMessage,
    ]);

    // Clear the user message input field
    userMessage = "";
    botMessage = "";
  };

  // Function to create a new message
  const createMessageRequest = async (threadId, content) => {
    try {
      const formData = new FormData();
      formData.append("threadId", threadId);
      formData.append("content", content);

      const response = await fetch("/api/messages", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      return data;
    } catch (error) {
      throw new Error("Failed to create message");
    }
  };

  // Function to run the assistant
  const runAssistantRequest = async (assistantId, threadId) => {
    try {
      const response = await fetch("/api/assistant/run", {
        method: "POST",
        body: JSON.stringify({ assistantId, threadId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      return data.id;
    } catch (error) {
      throw new Error("Failed to run the assistant");
    }
  };

  const checkRun = async (threadId, runId) => {
    try {
      // Sending a GET request to check the run thread
      const response = await fetch(
        `/api/thread/run?threadId=${threadId}&runId=${runId}`
      );

      // Parsing the JSON response
      const data = await response.json();

      // Returning the run check data
      return data.check.status;
    } catch (error) {
      return error;
    }
  };

  // Function to fetch all messages from a thread
  const getLastMsgId = async (threadId) => {
    try {
      const response = await fetch(
        `/api/messages/last_msg_id?threadId=${threadId}`
      );
      const data = await response.json();
      return data.messages;
    } catch (error) {
      throw new Error("Failed to fetch messages");
    }
  };

  // Function to fetch new messages
  const fetchNewMessages = async (threadId, lastMessageId) => {
    try {
      // Sending a GET request to fetch new messages
      const response = await fetch(
        `/api/messages/new_msgs?threadId=${threadId}&lastMessageId=${lastMessageId}`
      );

      // Parsing the JSON response
      const data = await response.json();

      return data.newMessages[0];
    } catch (error) {
      // Handling errors if any
      throw new Error("Failed to fetch new messages");
    }
  };

  const handleText = async (text) => {
    setPrompt(text);
    await handlePrompt();
  };

  const inputHandler = (e) => {
    setPrompt(e.target.value);
  };

  const handlePrompt = async () => {
    if (!prompt) {
      return;
    }

    // Function to handle delay between function calls
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      userMessage = prompt;
      createChat();
      assistantActiveHandler();
      setFirstTime(false);
      let status = "";
      await createMessageRequest(props.threadId, prompt);
      setPrompt("");
      const lastMsgId = await getLastMsgId(props.threadId);

      const runId = await runAssistantRequest(
        props.assistantId,
        props.threadId
      );

      status = await checkRun(props.threadId, runId);
      // Repeat until status is "completed"
      while (status !== "completed") {
        // Wait for 2 seconds before checking again
        await delay(2000);
        // Check the run status again
        status = await checkRun(props.threadId, runId);
      }

      if (status === "completed") {
        if (lastMsgId) {
          const botMsg = await fetchNewMessages(props.threadId, lastMsgId);
          botMessage = botMsg.content[0].text.value;
          botId = botMsg.id;
        }

        createChat();
        assistantActiveHandler();
      }
    } catch (error) {}
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div
      className={`bg-[#F3F3F3] relative h-[660px] w-[365px] rounded-[15px] flex flex-col justify-between font-poppinsRegular shadow-lg 
        `}
    >
      <div className="flex items-center text-center border-b-[1px] border-black justify-center  mt-3  rounded-tl-lg rounded-tr-lg text-white p-4 shadow-lg">
        <h1 className="text-xl text-black "> AI Doctor</h1>
      </div>
      {!props.assistantId || !props.threadId ? (
        <div className="top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="loader">
            <div className="loader-container">
              <div className="flex items-center justify-center p-4 rounded-[100px]"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 flex-1 overflow-y-auto bg-[#F3F3F3]">
            {firstTime && (
              <div className="flex flex-col ">
                {commonMessages.map((message, index) => (
                  <div
                    key={index}
                    onClick={() => handleText(message.text)}
                    className="mb-4 w-[100%] cursor-pointer   bg-[#3D3D3C] rounded-[8px] p-6  text-white  max-w-md  text-[14px]  "
                  >
                    <p className="text-white text-center text-[12px] ">
                      {message.text}
                    </p>
                  </div>
                ))}
                <p className="text-xs text-center text-[#9E9E9E]">
                  Above are the examples that what I can do for you!
                </p>
              </div>
            )}
            <div className="chat-window ">
              {chatMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {assistantActive ? (
                <div className="mb-4 p-3 bg-[#3D3D3C] rounded-br-[20px] rounded-tr-[20px] rounded-bl-[20px] w-[20%] shadow-md  text-[12px] ">
                  <div class="typing-loader"></div>
                </div>
              ) : (
                <></>
              )}
              <div ref={bottomRef} style={{ height: "0px", width: "0px" }} />
            </div>
          </div>
          {assistantActive ? (
            <div className="flex items-center justify-center rounded-bl-lg rounded-br-lg py-1 font-bold text-red-500  bg-[#EBF0F4] text-[11px] mb-2">
              Please wait assistant is getting response.
            </div>
          ) : (
            <></>
          )}
          <div className=" mb-6  ">
            <div className=" flex justify-center">
              <div className="flex items-center  bg-[#fff] justify-center shadow-lg rounded-lg px-2 py-1  rounded-[4px]   w-[75%]  ">
                <input
                  type="text"
                  placeholder="Ask me anything ?"
                  className="flex-1      text-[#475560] outline-none text-xs   text-[14px]  placeholder-opacity-100 placeholder-white::placeholder "
                  value={prompt}
                  onChange={inputHandler}
                  disabled={assistantActive}
                />

                <button
                  className=" text-white   text-xs rounded-lg ml-3 items-center flex justify-center cursor-pointer "
                  onTouchStart={startListening}
                  onMouseDown={startListening}
                  onTouchEnd={stopListening}
                  onMouseUp={stopListening}
                >
                  <Image
                    src={Microphone}
                    height={20}
                    width={20}
                    alt="microphone"
                  />
                </button>
                {/* <p>{listening ? "Stop Listening" : "Start Listening"}</p> */}
              </div>

              <button
                className="bg-red-500 p-3 ml-2 rounded-full shadow-md "
                onClick={handlePrompt}
                disabled={assistantActive}
              >
                <Image
                  src={assistantActive ? responseWait : sendArrow}
                  height={25}
                  width={25}
                  alt="submit button"
                  style={assistantActive ? { filter: "invert(100%)" } : ""}
                />
              </button>
            </div>
          </div>
        </>
      )}
      {/* <p className="text-black text-xs bg-white text-center"> {transcript}</p>{" "}
      <div className="flex items-center justify-center rounded-bl-lg rounded-br-lg py-1 font-bold text-black  bg-[#EBF0F4] text-[11px] ">
        Powered by MyclinicMD
      </div> */}
    </div>
  );
};

export default ChatInterface;
