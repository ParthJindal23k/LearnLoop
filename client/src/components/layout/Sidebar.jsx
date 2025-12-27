import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, LayoutDashboard, Users, UserPlus, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Friends", path: "/friends", icon: Users },
    { name: "Find Friends", path: "/find-friends", icon: UserPlus },
  ];

  return (
    <aside
      className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* HEADER */}
      <div className="h-16 px-4 flex items-center justify-between border-b">
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
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {collapsed ? (
            <Menu className="w-5 h-5 text-gray-600" />
          ) : (
            <X className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {/* ACTIVE INDICATOR */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-indigo-600" />
              )}

              <Icon
                className={`w-5 h-5 transition ${
                  isActive ? "text-indigo-600" : "text-gray-500"
                }`}
              />

              {!collapsed && (
                <span className="whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* USER FOOTER */}
      <div className="p-4 border-t">
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

            {/* ONLINE DOT */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>

          {!collapsed && user && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-green-600">
                Online
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
