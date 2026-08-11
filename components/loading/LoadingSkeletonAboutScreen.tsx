"use client";

export default function LoadingSkeletonAboutScreen() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-pulse">
      <div className="rounded-2xl bg-gray-200 h-[480px] sm:h-[420px]" />

      <div className="rounded-2xl bg-white border border-gray-100 p-8 space-y-6">
        <div className="h-8 w-72 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-100 h-24" />
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gray-300 h-48" />

      <div className="rounded-2xl bg-red-100 h-28" />
    </div>
  );
}
