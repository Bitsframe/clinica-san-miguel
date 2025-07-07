"use client";

type AnswerBlock = {
  type: "paragraph" | "bullet";
  content: string;
};

type QAItem = {
  question: string;
  answer: string | (string | AnswerBlock)[];
};

type QuestionAnswersProps = {
  items: QAItem[];
};

export default function QuestionAnswers({ items }: QuestionAnswersProps) {
  console.log("🔍 Received question_answers items:", items);

  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-6 bg-white p-6 border shadow rounded-lg">
      {items.map((item, index) => (
        <div key={index} className="space-y-2">
          <h3 className="font-semibold text-gray-800">{item.question}</h3>

          <div className="space-y-2 text-gray-700">
            {Array.isArray(item.answer) ? (
              item.answer.map((block, i) => {
                // String fallback
                if (typeof block === "string") {
                  return <p key={i}>{block}</p>;
                }

                // Structured AnswerBlock support
                if (block.type === "paragraph") {
                  return <p key={i}>{block.content}</p>;
                } else if (block.type === "bullet") {
                  return (
                    <ul key={i} className="list-disc list-inside ml-5">
                      <li>{block.content}</li>
                    </ul>
                  );
                }

                return null;
              })
            ) : (
              // Simple string as a single paragraph
              <p>{item.answer}</p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
