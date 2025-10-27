import { styles } from "@/app/[locale]/styles";
import {
  //   animated_team,
  breast_cancer_awareness,
  children,
  farm_lady,
} from "@/assets/images";
import { Team } from "@/components";
// import { OutlinedButton } from "@/utils";

// import Image from "next/image";

export const Blog = ({
  data,
}: {
  data:
    | Array<{
        id: number;
        created_at: string;
        title: string | null;
        image: string | null;
        content: string | null;
      }>
    | undefined
    | null;
}) => {
  const teams = [
    {
      id: 1,
      image: breast_cancer_awareness,
      date: "24.OCT.2022",
      description: "The Importance of Routine Mammogram",
    },
    {
      id: 2,
      image: children,
      date: "24.OCT.2022",
      description: "What to Expect During a School Physical Exam",
    },
    {
      id: 3,
      image: farm_lady,
      date: "24.OCT.2022",
      description: "Why You Shouldn't Skip Your Well-Woman Exam",
    },
  ];
  return (
    <section className="flex w-full flex-col items-center gap-10 my-5  md:px-[10%]">
      <article className="flex w-full flex-col items-center gap-4">
        <h1 className={`${styles.sectionHeadText} text-[#C1001F]`}>
          Our blogs
        </h1>
        <h3 className={`${styles.sectionSubText}  text-[#000000]`}>
          Find our latest articles
        </h3>
      </article>

      <article className="flex flex-wrap gap-7 items-center justify-center">
        {/* {teams.map((team) => (
          <Team
            image={team.image}
            date={team.date}
            description={team.description}
            key={team.id}
          />
        ))} */}
        {data &&
          data.map((team) => (
            <Team
              image={team.image}
              date={team.created_at}
              title={team.title}
              description={team.content}
              key={team.id}
            />
          ))}
      </article>
    </section>
  );
};
