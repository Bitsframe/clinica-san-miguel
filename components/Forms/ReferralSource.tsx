import { styles } from "@/app/[locale]/styles";
import React from "react";

const CheckBoxButton = ({ value, name, label }: any) => (
  <>
    <div className="flex items-center justify-start gap-3">
      <input
        type="checkbox"
        value={value}
        name={name}
        className="w-[25px] h-[25px] bg-transparent border-[2px] border-[#000000] hover:bg-[#ccc]"
      />{" "}
      <label className="text-[16px] text-customGray font-poppins">
        {label}
      </label>
    </div>
  </>
);

export const ReferralSource = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full gap-3">
      <div className="flex justify-start w-full">
        <div
          className={`border-[2px] border-dotted border-customGray rounded-[6.82px]  p-2 pr-4 ${styles.sectionSubText}`}
        >
          HOW DID YOU FIND OUT ABOUT THE CLINIC?
        </div>
      </div>
      <article className="w-full border-[2px] flex flex-col gap-5 border-[#000000] rounded-[10px] p-5">
        <div className="flex flex-col items-start justify-start gap-4">
          <div className="flex flex-col items-start gap-4">
            {[
              "Flyer",
              "Sign",
              "Google",
              "Facebook",
              "Passing By",
              "Referred",
              "Searching for a clinc",
            ].map((value, index) => (
              <CheckBoxButton
                key={index}
                value={value.toLowerCase()}
                name="referral"
                label={value}
              />
            ))}
          </div>
        </div>
      </article>
    </section>
  );
};
