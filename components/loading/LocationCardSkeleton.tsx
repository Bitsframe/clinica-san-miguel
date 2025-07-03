// components/LocationCardSkeleton.tsx

export const LocationCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-[#FFFEFC] rounded-[13px] w-full max-w-2xl min-h-56 sm:min-h-44 p-6 space-y-4">
      <div className="h-5 w-1/3 bg-gray-300 rounded" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
          <div className="h-4 w-1/2 bg-gray-300 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full" />
          <div className="h-4 w-2/3 bg-gray-300 rounded" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
        <div className="h-10 bg-gray-300 rounded-full w-full sm:w-40" />
        <div className="h-10 bg-gray-300 rounded-full w-full sm:w-40" />
      </div>
    </div>
  );
};
