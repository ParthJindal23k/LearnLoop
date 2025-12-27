import { THEMES } from "../../constants/themes";
import { useTheme } from "../../Context/ThemeContext";
import { Check } from "lucide-react";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        Choose Theme
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {THEMES.map((t) => {
          const active = theme === t.name;

          return (
            <button
              key={t.name}
              onClick={() => setTheme(t.name)}
              className={`relative px-4 py-3 rounded-lg border text-sm font-medium transition-all
                ${
                  active
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                }
              `}
            >
              <span>{t.label}</span>

              {/* ACTIVE CHECK */}
              {active && (
                <span className="absolute top-2 right-2 text-indigo-600">
                  <Check size={16} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;
