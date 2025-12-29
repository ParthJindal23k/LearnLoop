const FriendCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 animate-pulse">
      <div className="absolute top-4 right-4 w-6 h-6 bg-gray-200 rounded" />

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-3/4 bg-gray-200 rounded" />
      </div>

      <div className="h-11 w-full bg-gray-200 rounded-xl" />
    </div>
  );
};

export default FriendCardSkeleton;
