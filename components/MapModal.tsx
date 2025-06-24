"use client";

import { Map } from "@/components/Map";

export default function MapModal({
  location,
  onClose,
}: {
  location: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-12 z-[1000]">
      <div className="relative bg-white rounded-xl w-full max-w-[400px] h-[90vh] shadow-xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 z-[1001] text-red-600 text-2xl font-bold hover:scale-110 transition"
        >
          ✕
        </button>

        {/* Map Display */}
        <div className="pt-10 relative z-0">
          <Map location={location} height={600} />
        </div>
      </div>
    </div>
  );
}
