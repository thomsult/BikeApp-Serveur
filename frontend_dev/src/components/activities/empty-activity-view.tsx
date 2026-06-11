import { useTranslation } from "react-i18next";
import { PlusIcon } from "lucide-react";

export const EmptyActivityView = ({
  handleNewActivity,
}: {
  handleNewActivity: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={handleNewActivity}
      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/60 bg-primary/10 p-8 transition-colors hover:bg-primary/20"
    >
      <span className="flex rounded-full bg-primary p-1">
        <PlusIcon size={14} className="text-white" />
      </span>
      <span className="text-sm font-semibold text-primary">
        {t("components.activities.addActivity")}
      </span>
    </button>
  );
};