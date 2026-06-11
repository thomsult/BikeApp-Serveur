import { useTranslation } from "react-i18next";
export const MaintenanceBikeModal = () => {
  const { t } = useTranslation();
  return (
    <p className="text-sm text-gray-400">
      {t("app.equipment.maintenances.helpText")}
    </p>
  );
};
