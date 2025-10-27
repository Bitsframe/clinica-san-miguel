import { styles } from "@/app/[locale]/styles";
import {
  animated_team,
  breast_cancer_awareness,
  children,
  farm_lady,
} from "@/assets/images";
import { Team } from "@/components";
import { OutlinedButton } from "@/utils";

import Image from "next/image";

export const JoinTeam = () => {
  const teams = [
    {
      id: 1,
      image: breast_cancer_awareness,
      heading: "The Importance of routine Mammogram",
      description:
        "Detecting breast cancer is crucial to saving lives, for this reason it is recommended that all women over 40 years of age have an annual routine mammogram.",
    },
    {
      id: 2,
      image: children,
      heading: "What to expect from a School Physical Exam?",
      description:
        "School physical exams are important in diagnosing any critical health problems as they cover all aspects related to your child's health.",
    },
    {
      id: 3,
      image: farm_lady,
      heading: "Why you shouldn’t skip your Well-Women Exam",
      description:
        "Caring for your feminine health is essential to your long-term overall wellbeing. If you’re not sure why your well-woman exam is so important, read on to learn more.",
    },
  ];
  return (
    <section className="flex w-full flex-col items-center gap-20 my-14  md:px-[10%]">
      <h1 className={`${styles.sectionHeadText} text-[#C1001F]`}>
        Join our growing team!
      </h1>
      <article className="flex flex-col md:flex-row w-full justify-center items-center gap-5">
        <article className="w-full md:w-1/2 px-[5%] md:px-0">
          <Image src={animated_team} alt={""} className="w-full aspect-auto" />
        </article>
        <div className="flex flex-col justify-center items-center md:items-start md:justify-start gap-5 w-full px-[5%] md:px-0 md:w-1/2">
          <p
            className={`${styles.sectionSubText} md:text-start text-[#000000]`}
          >
            We love what we do and we do it with passion. We value the
            experimentation of the message and smart incentives.
          </p>
          <OutlinedButton
            text={"See Current Openings"}
            textColor={"#C1001F"}
            size={{
              width: "250px",
              height: "71px",
            }}
            route={""}
            borderColor={"#C1001F"}
          />
        </div>
      </article>

      {/* <article className="flex flex-wrap gap-7 items-center justify-center">
        {teams.map((team) => (
          <Team
            image={team.image}
            heading={team.heading}
            description={team.description}
            key={team.id}
          />
        ))}
      </article> */}
    </section>
  );
};
