
'use client'
import { useEffect, useState } from 'react';

const TextSlider = ({ texts = ['test', 'test', 'test'] }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => {
        if (prevIndex + 1 < texts.length) {
          return prevIndex + 1;
        } else {
          return 0;
        }
      });
    }, 5000); // Change text every 5 seconds

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="relative flex h-10 w-full items-center justify-center sm:h-11">
      <div className="absolute w-full h-full flex justify-center items-center px-10">
        {texts.map((text, index) => (
          <div
            key={index}
            className={`absolute w-full h-full flex justify-center items-center transition-transform duration-700 ${
              currentTextIndex === index
                ? "translate-x-0 opacity-100"
                : currentTextIndex < index
                ? "translate-x-full opacity-0"
                : "-translate-x-full opacity-0"
            }`}
            style={{ transitionTimingFunction: "ease-in-out" }}
          >
            <span className="text-xs sm:text-sm font-medium font-poppins tracking-wide text-[#F8F5F0]/95">
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextSlider;

