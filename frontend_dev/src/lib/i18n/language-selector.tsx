// LanguageSelector.tsx
import { useSelectedLanguage } from "./language-context";
import type { Language } from "./utils";

export const languages: { code: Language; label: string; name: string }[] = [
  { code: "en", label: "🇬🇧", name: "EN" },
  { code: "fr", label: "🇫🇷", name: "FR" },
];

const LanguageSelector = () => {
  const { language, setLanguage } = useSelectedLanguage();

  const currentIndex = languages.findIndex((l) => l.code === language);
  const current = languages[currentIndex] ?? languages[0];

  const cycleLanguage = () => {
    const next = languages[(currentIndex + 1) % languages.length];
    setLanguage(next.code);
  };

  return (
    <button
      onClick={cycleLanguage}
      aria-label={`Langue actuelle : ${current.name}. Cliquer pour changer.`}
      className="
        inline-flex items-center gap-1.5
        p-1 rounded-full
       
        backdrop-blur-sm
        text-xs font-medium
        text-black/60 dark:text-white/70
        transition-all duration-200
        hover:bg-black/10 dark:hover:bg-white/10
        hover:border-black/20 dark:hover:border-white/20
        cursor-pointer select-none
      "
    >
      <span className="text-sm">{current.label}</span>
      <span>{current.name}</span>
    </button>
  );
};

export default LanguageSelector;