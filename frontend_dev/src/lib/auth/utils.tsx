import type { TokenType } from "./auth";

const TOKEN = "token";

export const getStorageToken = (): TokenType | null => {
  const value = localStorage.getItem(TOKEN);
  return value ? JSON.parse(value) : null;
};

export const removeStorageToken = () => {
  localStorage.removeItem(TOKEN);
};

export const setStorageToken = (value: TokenType) => {
  localStorage.setItem(TOKEN, JSON.stringify(value));
};