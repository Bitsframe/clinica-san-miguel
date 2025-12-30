// Utility to convert Vapi conversation messages to Q&A pairs for normalization
// Usage: const qaPairs = conversationToQAPairs(messages);

export type ConversationMessage = {
  role: 'bot' | 'user' | 'system';
  message: string;
  [key: string]: any;
};

export type QAPair = {
  question: string;
  answer: string;
};

export function conversationToQAPairs(messages: ConversationMessage[]): QAPair[] {
  const qaPairs: QAPair[] = [];
  let lastQuestion: string | null = null;
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === 'bot') {
      lastQuestion = msg.message;
    } else if (msg.role === 'user' && lastQuestion) {
      qaPairs.push({ question: lastQuestion, answer: msg.message });
      lastQuestion = null;
    }
    // Ignore 'system' and other roles for Q&A
  }
  return qaPairs;
}
