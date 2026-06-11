// ThemeSelector.tsx
import { MoonIcon, SunDim } from "lucide-react";
import { useTheme } from "./use-theme";

const ThemeSelector = () => {
  const { toggleColorScheme, colorScheme } = useTheme();


  const toggle = () => {
    toggleColorScheme();
  };

  return (
    <button
      onClick={toggle}
      aria-label={colorScheme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
      className="
        inline-flex items-center gap-1.5
        p-1  rounded-full
        
      
        backdrop-blur-sm
        text-xs font-medium
        text-black/60 dark:text-white/70
        transition-all duration-200
        hover:bg-black/10 dark:hover:bg-white/10
        hover:border-black/20 dark:hover:border-white/20
        cursor-pointer select-none
      "
    >

      {colorScheme === "dark" ? <MoonIcon /> : <SunDim className="rotate-180" />}


    </button>
  );
};


export default ThemeSelector;