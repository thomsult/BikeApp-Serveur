// import { storage } from "../storage";

export type Language = string;

export const LOCAL = "local";
export const DEFAULT_LOCAL: Language = "fr";
export const SUPPORTED_LANGUAGES: Language[] = ["en", "fr"];

export const getExtLocalLanguage = (): Language => {
  const lang = localStorage.getItem(LOCAL);
  if (lang && SUPPORTED_LANGUAGES.includes(lang)) {
    return lang;
  }
  localStorage.setItem(LOCAL, DEFAULT_LOCAL);
  return DEFAULT_LOCAL;
}


export const setExtLocalLanguage = (lang: Language) => {
  localStorage.setItem(LOCAL, lang);
};
