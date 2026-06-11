import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";


export const EmptyAccessoriesCard = ({
  onClick,
  variant = "default",
}: {
  onClick: () => void;
  text?: string;
  variant?: "default" | "alt";
}) => {
  const { t } = useTranslation();
  const isAlt = variant === "alt";

  return (
    <button onClick={onClick} >
      <Card
        className="flex h-46  bg-background  items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed  p-4"
      >
        <PlusIcon size={40} className="text-primary" />
        {!isAlt && (
          <p
            className="text-base font-bold text-primary"
          >
            {t("app.equipment.accessories.addAccessory")}
          </p>
        )}

        <p
          className=" px-2 text-center text-xs font-medium "

        >
          {t("app.equipment.accessories.emptyAccessoriesDescription")}
        </p>

        {!isAlt && (
          <div className="flex items-center justify-center text-primary border border-primary rounded-full px-12 py-2 mt-2">
            <Plus size={16} className="mr-2" />
            {t("app.equipment.accessories.addAccessoryCTA")}
          </div>
        )}
      </Card>
    </button>
  );
};

// Alias pour garder la compatibilité avec l'ancien nom
export const EmptyAccessoriesCardAlt = ({
  onClick,
}: {
  onClick: () => void;
}) => {
  return <EmptyAccessoriesCard onClick={onClick} variant="alt" />;
};
