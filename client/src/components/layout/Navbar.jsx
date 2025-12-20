import NotificationBell from "../common/NotificationBell";
import Avatar from "../common/Avatar";
import ThemeDropdown from "../common/ThemeDropDown";

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-3 shrink-0">
      <ThemeDropdown />
      <NotificationBell />
      <Avatar />
    </header>
  );
};

export default Navbar;