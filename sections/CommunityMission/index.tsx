import { MdOutlineCenterFocusWeak } from "react-icons/md";
import { BiTargetLock } from "react-icons/bi";
import { FaWalking } from "react-icons/fa";
import { Mission } from "@/components";

export const CommunityMission = () => {
  const missionList = [
    {
      id: 1,
      icon: <MdOutlineCenterFocusWeak />,
      heading: "Patient-Centric Focus",
      content: "Our patients are at the core of our existence.",
    },
    {
      id: 2,
      icon: <BiTargetLock />,
      heading: "Targeting the Population",
      content:
        "We aim to serve the Hispanic community lacking health insurance.",
    },
    {
      id: 3,
      icon: <FaWalking />,
      heading: "Community Inclusivity",
      content: "Committed to welcoming our entire community.",
    },
    {
      id: 4,
      icon: <FaWalking />,
      heading: "Healthcare as a Right",
      content:
        "We believe health is a fundamental human need and a right for everyone.",
    },
    {
      id: 5,
      icon: <FaWalking />,
      heading: "No Insurance Required",
      content: "We offer healthcare without the need for insurance.",
    },
    {
      id: 6,
      icon: <FaWalking />,
      heading: "Walk-Ins Welcome",
      content:
        "Convenient accessibility for everyone, ensuring no one is turned away.",
    },
  ];

  return (
    <section className="flex w-full flex-col items-center bg-[#19192C] px-[5%] py-[4%]">
      <h3 className="text-[25px] text-[#F8F5F0] leading-5">Our community</h3>
      <h1 className="text-[#C1001F] text-center text-[70px] leading-[70px] font-bold">
        mission
      </h1>
      <div className="w-[80%] h-1 bg-white rounded-full my-[3%]"></div>
      <div className="flex flex-wrap justify-center items-center gap-7 ">
        {missionList.map((item) => (
          <Mission
            key={item.id}
            icon={item.icon}
            heading={item.heading}
            content={item.content}
          />
        ))}
      </div>
    </section>
  );
};