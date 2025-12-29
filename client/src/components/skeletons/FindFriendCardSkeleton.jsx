const FindFriendCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-gray-200" />

        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>

      <div className="space-y-2 mb-5">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
      </div>

      <div className="h-10 bg-gray-200 rounded-xl" />
    </div>
  );
};

export default FindFriendCardSkeleton;
