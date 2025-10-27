
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
    <div className="relative w-full h-12 overflow-hidden">
      <div className="absolute w-full h-full flex justify-center items-center">
        {texts.map((text, index) => (
          <div
            key={index}
            className={`absolute w-full h-full flex justify-center items-center transition-transform duration-1000 ${
              currentTextIndex === index
                ? 'translate-x-0'
                : currentTextIndex < index
                ? 'translate-x-full'
                : '-translate-x-full'
            }`}
            style={{ transitionTimingFunction: 'ease-in-out' }}
          >
            <span className="text-sm md:text-lg font-bold">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextSlider;

