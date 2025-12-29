const NotificationItemSkeleton = () => {
  return (
    <div className="p-4 border-b animate-pulse">
      <div className="flex gap-3">
        <div className="w-11 h-11 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default NotificationItemSkeleton;
