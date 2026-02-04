"use client";

interface ButtonProps {
  text: string;
  size?: { width?: string; height?: string }; // Made optional to favor className
  bgColor: string;
  textColor: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  text,
  size,
  bgColor,
  textColor,
  onClick,
  disabled = false,
  className = ""
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      /* - w-full: default to 100% width for mobile
         - md:w-auto: revert to content-width on tablets+
         - h-[50px]: default height if none provided
      */
      className={`rounded-[10px] font-poppins flex justify-center items-center 
        transition-all duration-200
        text-[14px] md:text-[17px] 
        hover:opacity-85 active:scale-95 
        disabled:opacity-30 disabled:pointer-events-none
        ${!className.includes('w-') ? 'w-full md:w-max' : ''} 
        ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        // Use the passed size only if specific Tailwind width classes aren't provided
        width: className.includes('w-') ? undefined : size?.width,
        height: size?.height || "50px",
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};