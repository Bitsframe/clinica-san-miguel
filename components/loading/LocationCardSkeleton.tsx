export const LocationCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-4 sm:p-5 space-y-4">
      <div className="flex justify-between gap-3">
        <div className="h-5 w-2/3 bg-gray-200 rounded" />
        <div className="h-6 w-16 bg-gray-100 rounded-full" />
      </div>
      <div className="rounded-lg bg-[#FAFAFA] p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
          <div className="h-4 w-full bg-gray-200 rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-10 bg-gray-200 rounded-full flex-1" />
        <div className="h-10 bg-gray-100 rounded-full flex-1 border border-gray-200" />
      </div>
    </div>
  );
};
