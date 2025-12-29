import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const Avatar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center focus:outline-none"
      >
        <img
          src="https://avatar.iran.liara.run/public"
          alt="avatar"
          className="
            w-9 h-9 sm:w-10 sm:h-10
            rounded-full
            ring-2 ring-blue-500/40
            hover:ring-blue-500
            transition
          "
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 sm:mt-3
            w-48 sm:w-52
            max-w-[90vw]
            bg-white
            rounded-xl
            shadow-xl
            border
            z-50
            animate-scale-in
          "
        >
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold text-gray-900">
              Account
            </p>
            <p className="text-xs text-gray-500">
              Manage your profile
            </p>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className="
                w-full flex items-center gap-3
                px-4 py-2.5
                text-sm text-gray-700
                hover:bg-gray-100
                transition
              "
            >
              <User size={16} />
              Edit Profile
            </button>

            <button
              onClick={logout}
              className="
                w-full flex items-center gap-3
                px-4 py-2.5
                text-sm text-red-600
                hover:bg-red-50
                transition
              "
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
