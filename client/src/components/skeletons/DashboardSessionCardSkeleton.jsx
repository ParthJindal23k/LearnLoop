const DashboardSessionCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded" />
      </div>

      <div className="h-12 w-full bg-gray-200 rounded-xl" />
    </div>
  );
};

export default DashboardSessionCardSkeleton;
