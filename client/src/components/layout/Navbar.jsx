import NotificationBell from "../common/NotificationBell";
import Avatar from "../common/Avatar";
import ThemeDropdown from "../common/ThemeDropDown";

const Navbar = () => {
  return (
    <header className="h-18 bg-white border-b border-gray-200 flex items-center justify-end px-6 shrink-0">
      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
        {/* Theme */}
        <div className="hover:bg-gray-100 p-2 rounded-lg transition">
          <ThemeDropdown />
        </div>

        {/* Notifications */}
        <div className="hover:bg-gray-100 p-2 rounded-lg transition">
          <NotificationBell />
        </div>

        {/* Avatar */}
        <div className="hover:bg-gray-100 p-1 rounded-full transition">
          <Avatar />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
