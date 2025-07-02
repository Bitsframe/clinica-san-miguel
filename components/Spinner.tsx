export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#C1001F] border-opacity-50"></div>
      <p className="text-[#C1001F] text-lg font-semibold font-poppins typing-text">
        Please wait...
      </p>

      <style jsx>{`
        .typing-text {
          overflow: hidden;
          border-right: 2px solid #C1001F;
          white-space: nowrap;
          width: 0;
          animation: typing 2s steps(12) forwards, blink 0.7s step-end infinite;
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes blink {
          50% {
            border-color: transparent;
          }
        }
      `}</style>
    </div>
  );
}
