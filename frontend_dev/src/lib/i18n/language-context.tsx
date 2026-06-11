import { createContext, useCallback, useContext, useEffect, useState } from "react";

import i18n from ".";
import {
  DEFAULT_LOCAL,
  getExtLocalLanguage,
  type Language,
  LOCAL,
  setExtLocalLanguage,
} from "./utils";
import { queryClient } from "../api/common";

export const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
}>({
  language: getExtLocalLanguage(),
  setLanguage: () => { },
});

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState<Language>(getExtLocalLanguage());
  const setLanguage = useCallback(
    (lang: Language) => {
      setExtLocalLanguage(lang);
      setLanguageState(lang);
      if (lang !== undefined) void i18n.changeLanguage(lang);
    },
    [],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
export function useSelectedLanguage(): {
  language: Language;
  setLanguage: (lang: Language) => void;
} {
  if (!useContext(LanguageContext)) {
    throw new Error(
      "useSelectedLanguage must be used within a LanguageProvider",
    );
  }
  return useContext(LanguageContext);
}
export const changeLanguage = (lang: Language) => {
  setExtLocalLanguage(lang);
  i18n.changeLanguage(lang, (err) => {
    if (err) {
      console.error("Error changing language:", err);
    }
  });
  queryClient.invalidateQueries({ queryKey: ["bikes/types"] });
};
