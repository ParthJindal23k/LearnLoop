import Sidebar from "./SideBar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-x-hidden">
      
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        
        <div className="bg-white border-b shadow-sm sticky top-0 z-20">
          <Navbar />
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-3 sm:p-4 md:p-6">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border p-4 sm:p-5 md:p-6 min-h-full">
              {children}
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
