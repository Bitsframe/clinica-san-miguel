"use client";

type FaqAnswerBlock = {
  type: "paragraph" | "bullet";
  content: string;
};

type Faq = {
  question: string;
  answer: FaqAnswerBlock[] | string | string[];
};

type FaqsProps = {
  faqs: Faq[] | null;
};

export default function Faqs({ faqs }: FaqsProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="space-y-6 bg-white shadow rounded-lg p-6 border">
      <h2 className="text-xl font-bold text-[#C1001F]">Frequently Asked Questions</h2>

      {faqs.map((faq, index) => (
        <div key={index} className="space-y-2">
          <h3 className="font-semibold text-gray-800">{faq.question}</h3>

          <div className="space-y-2 text-gray-700">
            {Array.isArray(faq.answer) ? (
              // Old array of strings (bullets)
              typeof faq.answer[0] === "string" ? (
                <ul className="list-disc list-inside ml-5">
                  {(faq.answer as string[]).map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              ) : (
                // New block-based format
                (faq.answer as FaqAnswerBlock[]).map((block, i) => {
                  if (block.type === "paragraph") {
                    return <p key={i}>{block.content}</p>;
                  }
                  if (block.type === "bullet") {
                    return (
                      <ul key={i} className="list-disc list-inside ml-5">
                        <li>{block.content}</li>
                      </ul>
                    );
                  }
                  return null;
                })
              )
            ) : typeof faq.answer === "string" ? (
              <p>{faq.answer}</p>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  );
}
