import { createContext, useEffect, useState } from "react";
import { NAV_THEME } from ".";

const ThemeContext = createContext({
  toggleColorScheme: () => { },
  setColorScheme: (scheme: "light" | "dark") => { },
  colorScheme: "light" as "light" | "dark",
  theme: NAV_THEME.light,
});

type Props = {
  children: React.ReactNode;
};

function ThemeProvider({ children }: Props) {
  const getInitialTheme = (): "light" | "dark" => {
    const stored = localStorage.getItem("color-scheme");

    if (stored === "dark" || stored === "light") {
      return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [colorScheme, setColorScheme] = useState<"light" | "dark">(getInitialTheme);

  // 🔥 Synchronisation DOM + localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", colorScheme === "dark");
    localStorage.setItem("color-scheme", colorScheme);
  }, [colorScheme]);

  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: NAV_THEME[colorScheme],
        toggleColorScheme,
        setColorScheme,
        colorScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };