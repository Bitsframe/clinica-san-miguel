// // import { OpenAI } from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// //check on the run thread
// const runCheck = async ({ threadId, runId }) => {
//   const check = await openai.beta.threads.runs.retrieve(threadId, runId);
//   return check;
// };

// //run assistants
// const runAssistant = async ({ assistantId, threadId }) => {
//   const run = await openai.beta.threads.runs.create(threadId, {
//     assistant_id: assistantId,
//   });
//   return run;
// };

// //getting assistants for having id
// const getAllAssitants = async () => {
//   const myAssistants = await openai.beta.assistants.list();
//   return myAssistants;
// };

// //create thread
// const createThread = async () => {
//   const thread = await openai.beta.threads.create();
//   return thread;
// };

// //get thread
// const getThread = async (threadId) => {
//   const thread = await openai.beta.threads.retrieve(threadId);
//   return thread;
// };

// //create message
// const createMessage = async ({ threadId, content }) => {
//   const messages = await openai.beta.threads.messages.create(threadId, {
//     role: "user",
//     content: content,
//   });
//   return messages;
// };

// //get new messages
// const getNewMessages = async (threadId, lastMessageId) => {
//   const getNewMessages = await openai.beta.threads.messages.list(threadId, {
//     order: "desc",
//     before: lastMessageId,
//   });
//   return getNewMessages.data;
// };

// //get last message id
// const getLastMessageId = async (threadId) => {
//   const response = await openai.beta.threads.messages.list(threadId, {
//     order: "desc",
//     limit: 1,
//   });

//   const lastMessageId = response.data.length > 0 ? response.data[0].id : null;
//   return lastMessageId;
// };

// module.exports = {
//   getAllAssitants,
//   runCheck,
//   getLastMessageId,
//   getNewMessages,
//   createMessage,
//   createThread,
//   getThread,
//   runAssistant,
// };
