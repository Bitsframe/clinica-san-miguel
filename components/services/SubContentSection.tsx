// components/SubContentSection.tsx
type ContentBlock = {
  type: "paragraph" | "bullet";
  content: string;
};

type SubContentSectionProps = {
  subheading: string | null;
  sub_content: ContentBlock[] | null;
};

export default function SubContentSection({
  subheading,
  sub_content,
}: SubContentSectionProps) {
  if (!subheading && (!sub_content || sub_content.length === 0)) return null;

  return (
    <div className="space-y-2">
      {subheading && (
        <h2 className="text-lg font-semibold text-gray-800">{subheading}</h2>
      )}
      {Array.isArray(sub_content) &&
        sub_content.map((block, index) =>
          block.type === "paragraph" ? (
            <p key={index} className="text-sm text-gray-600">
              {block.content}
            </p>
          ) : (
            <ul key={index} className="list-disc list-inside text-sm text-gray-600">
              <li>{block.content}</li>
            </ul>
          )
        )}
    </div>
  );
}
