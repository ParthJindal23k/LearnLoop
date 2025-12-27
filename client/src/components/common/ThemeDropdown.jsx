import { useState, useRef, useEffect } from "react";
import { THEMES } from "../../constants/themes";
import { useTheme } from "../../Context/ThemeContext";
import { Palette, ChevronDown } from "lucide-react";

const ThemeDropdown = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 transition shadow-sm"
        style={{
          borderColor: "var(--primary-color)",
          color: "var(--text-color)",
        }}
      >
        <Palette size={16} />
        <span className="text-sm font-medium">Theme</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-56 rounded-xl border shadow-xl z-50 overflow-hidden animate-fade-in"
          style={{
            backgroundColor: "var(--bg-color)",
            borderColor: "var(--secondary-color)",
            maxHeight: "300px",
          }}
        >
          {THEMES.map((t) => {
            const isActive = theme === t.name;

            return (
              <button
                key={t.name}
                onClick={() => {
                  setTheme(t.name);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "font-semibold bg-black/5"
                    : "hover:bg-black/5"
                }`}
                style={{ color: "var(--text-color)" }}
              >
                <span>{t.label}</span>
                {isActive && (
                  <span className="text-xs opacity-70">Active</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeDropdown;
