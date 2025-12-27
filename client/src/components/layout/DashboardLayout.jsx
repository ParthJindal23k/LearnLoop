import Sidebar from "./sideBar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* NAVBAR */}
        <div className="bg-white border-b shadow-sm">
          <Navbar />
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-6">
            <div className="bg-white rounded-2xl shadow-sm border p-6 min-h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
