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
    <section className="space-y-6">
      {subheading && (
        <div className="rounded-xl bg-[#F8F5F0] border border-[#e8e4df] px-6 py-5 sm:px-8 sm:py-6">
          <p className="text-base sm:text-lg font-medium text-[#19192C] font-poppins leading-relaxed text-center sm:text-left">
            {subheading}
          </p>
        </div>
      )}

      {Array.isArray(sub_content) && sub_content.length > 0 && (
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4">
          {sub_content.map((block, index) =>
            block.type === "paragraph" ? (
              <p
                key={index}
                className="text-sm sm:text-base text-[#3D3D3C] font-inter leading-relaxed"
              >
                {block.content}
              </p>
            ) : (
              <ul
                key={index}
                className="list-disc list-inside text-sm sm:text-base text-[#3D3D3C] font-inter space-y-1 ml-1"
              >
                <li>{block.content}</li>
              </ul>
            )
          )}
        </div>
      )}
    </section>
  );
}
