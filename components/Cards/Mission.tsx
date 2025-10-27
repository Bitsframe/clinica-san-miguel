import Image from "next/image";

export const Mission = ({
  icon,
  heading,
  content,
}: {
  icon: string | null;
  heading: string | null;
  content: string | null;
}) => {
  const customLoader = ({ src, width, quality }: any) => {
    // Modify the src URL as needed
    // For example, you might strip out query parameters
    const urlWithoutQuery = src.split("?")[0];
    // Use the quality parameter if it's provided, otherwise default to a value
    const qualityParam = quality ? `&q=${quality}` : "";
    return `${urlWithoutQuery}?w=${width}${qualityParam}`;
  };
  return (
    <article className="w-[350px] h-auto lg:h-[230px] rounded-[10px] bg-transparent lg:bg-[#F8F5F0] lg:shadow-md flex flex-col justify-center items-center lg:items-start p-4">
      <Image
        src={icon || ""}
        alt=""
        width={40}
        height={40}
        className="w-[40px] h-[40px] aspect-auto"
        loader={customLoader}
      />

      <div className="flex flex-col justify-center lg:justify-start items-center lg:items-start">
        <h3 className="text-[22px] text-white lg:text-customGray font-poppins">
          {heading}:
        </h3>
        <p className="text-[16px] text-white lg:text-customGray text-center lg:text-left font-poppins">
          {content}
        </p>
      </div>
    </article>
  );
};
