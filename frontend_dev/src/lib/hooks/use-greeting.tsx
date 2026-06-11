import { useTranslation } from "react-i18next";

export const useGreeting = () => {
  const { t } = useTranslation();

  const hour = new Date().getHours();

  if (hour < 12) return t("components.greeting.morning");
  if (hour < 18) return t("components.greeting.afternoon");
  return t("components.greeting.evening");
};
