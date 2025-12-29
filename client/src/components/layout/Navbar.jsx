import NotificationBell from "../common/NotificationBell";
import Avatar from "../common/Avatar";

const Navbar = () => {
  return (
    <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-end px-3 sm:px-6 shrink-0">
      
      <div className="flex items-center gap-1 sm:gap-3 bg-gray-50 border border-gray-200 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm">
        
        <div className="hover:bg-gray-100 p-2 rounded-lg transition">
          <NotificationBell />
        </div>

        <div className="hover:bg-gray-100 p-1 rounded-full transition">
          <Avatar />
        </div>

      </div>
    </header>
  );
};

export default Navbar;
