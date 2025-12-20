import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar */}
      <img
        src="https://avatar.iran.liara.run/public"
        alt="avatar"
        className="w-9 h-9 rounded-full cursor-pointer"
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <button
            onClick={() => {
              setOpen(false);
              navigate("/profile");
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Edit Profile
          </button>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 hover:bg-red-600 text-red-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Avatar;
