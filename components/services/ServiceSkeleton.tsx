"use client";

export default function ServiceSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-pulse">
      {/* Hero */}
      <div className="rounded-2xl bg-gray-200 h-[480px] sm:h-[420px]" />

      {/* Subheading banner */}
      <div className="rounded-xl bg-gray-100 h-20" />

      {/* Q&A grid */}
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-6 space-y-3">
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-5/6 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="space-y-4">
        <div className="h-8 w-56 bg-gray-200 rounded" />
        <div className="rounded-xl border border-gray-100 divide-y">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="px-6 py-5">
              <div className="h-5 w-2/3 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-red-100 h-36" />
    </div>
  );
}
