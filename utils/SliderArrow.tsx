import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

export function SampleNextArrow(props: {
  className: any;
  style: any;
  onClick: any;
}) {
  const { className, style, onClick } = props;
  return (
    <button
      className={"top-[-40px] tablet:left-[55%]"}
      onClick={onClick}
      style={{
        fontSize: "40px",
        opacity: "1",
        color: "#FFB636",
        position: "absolute",
        right: "60px",
        // left: "70%",
        top: "-40px",
        // transform: `translate(${-800}%,${-1200}%)`,
      }}
    >
      <div className="font-montserrat font-[600] text-[14px] text-[#FFFFFF] flex items-center gap-2">
        <div className="font-montserrat text-[14px] text-[#FFFFFF] uppercase">
          next
        </div>
        <div className="font-montserrat text-[14px] font-[600] text-[#FFFFFF]">
          <HiOutlineArrowNarrowRight />
        </div>
      </div>
    </button>
  );
}

export function SamplePrevArrow(props: {
  className: any;
  style: any;
  onClick: any;
}) {
  const { className, style, onClick } = props;
  return (
    <div
      className={
        "absolute top-[-40px] right-[150px] tablet:left-[35%] mobile:left-[30%] tablet:top-[-40px]"
      }
      onClick={onClick}
      style={{
        // ...style,
        fontSize: "40px",
        opacity: "1",
        color: "#FFB636",
        position: "absolute",
        // right: "100px",
        // left: "70%",
        // top: "-40px",
        // transform: `translate(${200}%,${-1180}%)`,
      }}
    >
      <div className="font-montserrat text-[14px] font-[600] text-[#FFFFFF] flex items-center gap-2">
        <div className="font-montserrat text-[14px] font-[600] text-[#FFFFFF]">
          <HiOutlineArrowNarrowLeft />
        </div>
        <div className="font-montserrat text-[14px] text-[#FFFFFF] uppercase">
          prev
        </div>
      </div>
    </div>
  );
}
