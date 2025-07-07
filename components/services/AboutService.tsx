"use client";

import Image from "next/image";

type ContentBlock = {
  type: "paragraph" | "bullet";
  content: string;
};

type AboutServiceProps = {
  title: string;
  about_content: string | null;
  subheading: string | null;
  sub_content: ContentBlock[] | null; // ✅ changed from Record<string, ContentBlock[]>
  image_url: string | null;
};

export default function AboutService({
  title,
  about_content,
  subheading,
  sub_content,
  image_url,
}: AboutServiceProps) {
  console.log("🔍 sub_content received:", sub_content);

  return (
    <section className="space-y-4 bg-white shadow rounded-lg p-6 border">
      {image_url && (
        <div className="w-full h-[300px] relative rounded-md overflow-hidden">
          <Image
            src={image_url}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>
      )}

      <h1 className="text-2xl font-bold text-[#C1001F]">{title}</h1>

      {about_content && (
        <p className="text-base text-gray-700">{about_content}</p>
      )}

      {subheading && (
        <h2 className="text-lg font-semibold text-gray-800">{subheading}</h2>
      )}

      {Array.isArray(sub_content) && (
        <div className="space-y-2">
          {sub_content.map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <p key={index} className="text-sm text-gray-600">
                  {block.content}
                </p>
              );
            }

            return (
              <ul key={index} className="list-disc list-inside text-sm text-gray-600">
                <li>{block.content}</li>
              </ul>
            );
          })}
        </div>
      )}
    </section>
  );
}
