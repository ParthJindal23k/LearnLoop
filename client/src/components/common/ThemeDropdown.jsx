import { useState, useRef, useEffect } from "react";
import { THEMES } from "../../constants/themes";
import { useTheme } from "../../Context/ThemeContext";

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
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            {/* Button */}
            <button
                onClick={() => setOpen(!open)}
                className="px-3 py-1 rounded text-sm border"
                style={{
                    borderColor: "var(--primary-color)",
                    color: "var(--text-color)",
                }}
            >
                Theme ▾
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute right-0 mt-2 w-48 rounded shadow-lg z-50 overflow-y-auto"
                    style={{
                        backgroundColor: "var(--bg-color)",
                        maxHeight: "300px", // ✅ height limit
                    }}
                >
                    {THEMES.map((t) => (
                        <button
                            key={t.name}
                            onClick={() => {
                                setTheme(t.name);
                                setOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:opacity-80 ${theme === t.name ? "font-semibold" : ""
                                }`}
                            style={{ color: "var(--text-color)" }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThemeDropdown;
