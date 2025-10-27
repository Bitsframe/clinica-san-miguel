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
        className="w-[350px]  h-[182px] rounded-[10px] flex z-20 justify-center items-center"
        style={{ boxShadow: "2px 3px 6px 6px rgba(0, 0, 0, 0.2)" }}
      >
        <Image
          src={image}
          alt="additional service image"
          className="w-full h-full object-cover rounded-[10px]"
        />
      </div>
      <div className="w-[335px] h-[180px] rounded-[10px] bg-customGray  mt-[-40px] pt-[45px] p-3">
        <div className=" flex flex-col gap-2 pb-6 overflow-auto">
          <h1 className="text-[20px] font-poppins text-[#F8F5F0] text-left">
            {heading}
          </h1>
          <p className="text-[16px] text-[#F8F5F0] font-poppins">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
};
