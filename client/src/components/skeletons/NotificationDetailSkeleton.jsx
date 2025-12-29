const NotificationDetailSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border p-6 animate-pulse">
      <div className="flex gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>

      <div className="flex gap-4">
        <div className="h-10 w-24 bg-gray-200 rounded-lg" />
        <div className="h-10 w-24 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export default NotificationDetailSkeleton;
