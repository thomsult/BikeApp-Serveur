import { useTranslation } from "react-i18next";
import { useAllComponentBikes } from "@/lib/api/equipments";
import BikeModalAccessories from "./bike-accessories";

export const EquipmentAccessoriesView = () => {
  const { data: equipments = [] } = useAllComponentBikes();
  const { t } = useTranslation();
  return (
    <>
      <div className="flex-row items-center justify-between">
        <p
          className="text-lg font-bold"
        >
          {t("common.accessories", { count: equipments.length })}
          {equipments.length && equipments.length > 0
            ? ` (${equipments.length})`
            : ""}
        </p>
      </div>

      <BikeModalAccessories />
    </>
  );
};
