import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, LayoutDashboard, Users, UserPlus, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false); 
  const [open, setOpen] = useState(false); 
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Friends", path: "/friends", icon: Users },
    { name: "Find Friends", path: "/find-friends", icon: UserPlus },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0
          z-40
          bg-white border-r border-gray-200
          flex flex-col
          transition-transform duration-300
          h-screen
          ${collapsed ? "w-20" : "w-72"}
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow">
                <span className="text-white font-bold text-sm">SS</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">
                SkillSwap
              </h1>
            </div>
          )}

          <button
            onClick={() =>
              window.innerWidth < 768
                ? setOpen(false)
                : setCollapsed(!collapsed)
            }
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {collapsed || open ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-indigo-600" />
                )}

                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-indigo-600" : "text-gray-500"
                  }`}
                />

                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t shrink-0">
          <div
            className={`flex items-center gap-3 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>

            {!collapsed && user && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <button
        onClick={() => setOpen(true)}
        className="
          fixed bottom-4 left-4
          z-[9999]
          md:hidden
          p-3
          rounded-full
          bg-indigo-600
          text-white
          shadow-lg
        "
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
};

export default Sidebar;
