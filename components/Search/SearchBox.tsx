import { Button } from "@/utils";
// import Image from "next/image";
import { BiTargetLock } from "react-icons/bi";

export const SearchBox = () => {
  return (
    <div className="flex gap-4 items-center">
      <div className="w-[295px] flex justify-between items-center h-[48px] rounded-[10px] px-2 border-[2px] border-[#000000]">
        <input className="w-[80%] outline-none text-[#000000] bg-transparent text-[16px]" />
        <div className="text-[27px] text-[#ccc]">
          <BiTargetLock />
        </div>
      </div>
      <Button
        text={"search"}
        size={{ width: "192px", height: "48px" }}
        route={""}
        bgColor={"#3D3D3C"}
        textColor={"#ffffff"}
        onClick={() => {}}
      />
    </div>
  );
};
