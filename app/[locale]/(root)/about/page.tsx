import { Metadata } from "next";
import AboutScreen from "./AboutScreen";

interface Props {
  params: {
    locale: string;
  };
}

export default function About({ params }: Props) {
  return <AboutScreen />;
}
