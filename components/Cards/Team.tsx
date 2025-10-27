import Image from "next/image";

export const Team = ({
  image,
  date,
  title,
  description,
}: {
  image: any;
  date: string;
  title: string | null;
  description: string | null;
}) => {
  return (
    <article className="flex flex-col w-[340px] gap-7 justify-center items-center">
      {image && (
        <Image
          src={image}
          alt={""}
          className="w-full h-[179px] aspect-auto rounded-[10px] object-contain"
        />
      )}
      <div
        className="relative w-full p-3 bg-transparent flex flex-col items-start justify-center"
        style={{ zIndex: 20 }}
      >
        {/* <div
          className="absolute top-0 left-5 mt-[-25px]"
          style={{
            borderStyle: "solid",
            borderColor: "transparent transparent #3D3D3C transparent",
            borderWidth: "0 44.5px 50px 44.5px",
            display: "inline-block",
            height: 0,
            width: 0,
            borderRadius: "10px",
            zIndex: 10,
          }}
        ></div> */}
        <h3 className="text-[#AAAAAA] font-poppins text-[14px] text-left">
          {date}
        </h3>
        <p className="text-[#121212] font-poppins font-semibold text-[18px] text-left">
          {title}
        </p>
      </div>
    </article>
  );
};
