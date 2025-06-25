// import AboutScreen from "./AboutScreen";

// const About = ({ params: { locale } }: { params: { locale: string } }) => {
//   return <AboutScreen />;
// };

// export default About;

import { Metadata } from "next";
import AboutScreen from "./AboutScreen";

type PageProps = {
  params: {
    locale: string;
  };
};

const About = ({ params }: PageProps) => {
  return <AboutScreen />;
};

export default About;
