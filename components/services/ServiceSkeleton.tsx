// components/services/ServiceSkeleton.tsx
"use client";

export default function ServiceSkeleton() {
  return (
    <div className="w-full px-4 py-10 md:px-6 lg:px-8 max-w-screen-xl mx-auto space-y-8 animate-pulse">
      {/* Title */}
      <div className="h-10 md:h-14 bg-red-200 rounded w-3/4 mx-auto" />

      {/* Image and About box */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="w-full md:w-1/3 h-64 md:h-[400px] bg-gray-300 rounded-lg" />

        {/* About box */}
        <div className="w-full md:w-2/3 flex flex-col gap-4 bg-gray-200 rounded-lg p-6">
          <div className="h-6 w-1/3 bg-gray-400 rounded" />
          <div className="h-4 w-full bg-gray-300 rounded" />
          <div className="h-4 w-5/6 bg-gray-300 rounded" />
          <div className="h-4 w-2/3 bg-gray-300 rounded" />
        </div>
      </div>

      {/* SubContent block */}
      <div className="space-y-4">
        <div className="h-6 w-1/4 bg-gray-300 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>

      {/* FAQ / QA blocks */}
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-5 w-1/3 bg-gray-400 rounded" />
            <div className="h-4 w-full bg-gray-300 rounded" />
            <div className="h-4 w-2/3 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
