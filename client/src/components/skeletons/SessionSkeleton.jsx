const Bubble = ({ align = "left" }) => (
  <div
    className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`h-10 w-48 rounded-lg animate-pulse ${
        align === "right" ? "bg-[#cdeccd]" : "bg-gray-200"
      }`}
    />
  </div>
);

const SessionSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#efeae2] flex justify-center py-6">
      <div className="w-full max-w-4xl bg-[#f0f2f5] rounded-xl shadow-xl flex flex-col overflow-hidden">

        <div className="h-16 px-4 flex items-center gap-3 bg-[#ededed] border-b">
          <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-32 bg-gray-300 rounded animate-pulse" />
            <div className="h-2 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="flex-1 px-6 py-4 space-y-4">
          <Bubble />
          <Bubble />
          <Bubble align="right" />
          <Bubble />
          <Bubble align="right" />
        </div>

        <div className="h-16 px-4 flex items-center gap-3 bg-[#ededed] border-t">
          <div className="flex-1 h-10 bg-white rounded-full animate-pulse" />
          <div className="h-10 w-10 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SessionSkeleton;
