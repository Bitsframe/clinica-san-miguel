"use client";

export default function LoadingLocationCard() {
  return (
    <article className="w-full rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="h-[150px] bg-gray-200" />
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 flex-1 bg-gray-200 rounded-full" />
          <div className="h-10 flex-1 bg-gray-100 rounded-full" />
        </div>
      </div>
    </article>
  );
}
