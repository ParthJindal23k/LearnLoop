import { THEMES } from "../../constants/themes";
import { useTheme } from "../../Context/ThemeContext";
const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="bg-gray-800 text-white p-1 rounded"
    >
      {THEMES.map((t) => (
        <option key={t.name} value={t.name}>
          {t.label}
        </option>
      ))}
    </select>
  );
};

export default ThemeSelector;
