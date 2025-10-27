import localFont from "next/font/local";

const antipasto = localFont({
  src: [
    {
      path: "../public/fonts/antipasto/AntipastoPro-Medium_trial.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/antipasto/AntipastoPro-DemiBold_trial.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-antipasto",
  display: "swap",
});

export default antipasto;
