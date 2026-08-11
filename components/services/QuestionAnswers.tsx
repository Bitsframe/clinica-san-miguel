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
  heading: string;
};

function renderAnswer(answer: string | (string | AnswerBlock)[]) {
  if (!Array.isArray(answer)) {
    return <p className="text-sm sm:text-base text-[#3D3D3C] leading-relaxed">{answer}</p>;
  }

  return (
    <div className="space-y-2">
      {answer.map((block, i) => {
        if (typeof block === "string") {
          return (
            <p key={i} className="text-sm sm:text-base text-[#3D3D3C] leading-relaxed">
              {block}
            </p>
          );
        }
        if (block.type === "paragraph") {
          return (
            <p key={i} className="text-sm sm:text-base text-[#3D3D3C] leading-relaxed">
              {block.content}
            </p>
          );
        }
        if (block.type === "bullet") {
          return (
            <ul key={i} className="list-disc list-inside text-sm sm:text-base text-[#3D3D3C] ml-1">
              <li>{block.content}</li>
            </ul>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function QuestionAnswers({ items, heading }: QuestionAnswersProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-[#19192C]">
        {heading}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {items.map((item, index) => (
          <article
            key={index}
            className="group relative rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl bg-[#C1001F] opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C1001F]/10 text-sm font-bold text-[#C1001F]">
                {index + 1}
              </span>
              <div className="space-y-3 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold font-poppins text-[#19192C]">
                  {item.question}
                </h3>
                {renderAnswer(item.answer)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
