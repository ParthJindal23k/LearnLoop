import { createContext, useContext, useEffect, useState } from "react";
import { THEMES } from "../constants/themes";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const themeObj = THEMES.find((t) => t.name === theme);
    if (!themeObj) return;

    const root = document.documentElement;

    root.style.setProperty("--bg-color", themeObj.colors.bg);
    root.style.setProperty("--primary-color", themeObj.colors.primary);
    root.style.setProperty("--secondary-color", themeObj.colors.secondary);
    root.style.setProperty("--text-color", themeObj.colors.text);

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
