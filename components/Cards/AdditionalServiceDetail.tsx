import Image from "next/image";

export const AdditionalService = ({
  image,
  heading,
  description,
}: {
  image: any;
  heading: string;
  description: string;
}) => {
  return (
    <article className="relative flex flex-col justify-center items-center">
      <div
        className="w-[360px] h-[192px] rounded-[10px] flex z-20 justify-center items-center"
        style={{ boxShadow: "2px 3px 6px 6px rgba(0, 0, 0, 0.2)" }}
      >
        <Image
          src={image}
          alt="additional service image"
          className="w-full h-full object-cover rounded-[10px]"
        />
      </div>
      <div className="w-[345px] h-[190px] rounded-[10px] bg-customGray mt-[-50px] pt-[55px] p-3 flex flex-col gap-1">
        <h1 className="text-[25px] font-poppins text-[#F8F5F0] text-left">
          {heading}
        </h1>
        <article>
          <p className="text-[16px] text-[#F8F5F0] font-poppins  overflow-y-auto">
            {description}
          </p>
        </article>
      </div>
    </article>
  );
};
