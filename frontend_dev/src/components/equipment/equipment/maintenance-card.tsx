import { differenceInDays, format, formatRelative } from "date-fns";
import { enGB, fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Bike, Wrench, Check, TagIcon, ChevronRightIcon } from "lucide-react";
import type { ActivityMaintenanceT } from "@/lib/api/activity/activity";
import { getExtLocalLanguage } from "@/lib/i18n/utils";
import { Card } from "@/components/ui/card";


export const EquipmentMaintenanceCard = ({
  task,
  handleClick,
}: {
  task: ActivityMaintenanceT;
  handleClick: () => void;
}) => {
  const { t } = useTranslation();

  const dueDate = new Date(task.dt_start);
  const daysRemaining = differenceInDays(dueDate, new Date());

  const langue = getExtLocalLanguage();
  const Locale = langue === "fr" ? fr : enGB;

  const equipment = task.bike
    ? task.bike
    : task.component
      ? task.component
      : t("components.activities.unknownEquipment");

  return (
    <button onClick={handleClick} className="w-full text-left">
      <Card className="relative flex flex-row items-center overflow-hidden p-4">
        {/* Content Container */}
        <div className="mr-4 flex shrink-0 flex-col items-center justify-center rounded-lg bg-primary/20 p-2">
          <span className="text-2xl font-bold">
            {task.dt_start ? new Date(task.dt_start).getDate() : ""}
          </span>
          <span className="text-center text-xs font-medium capitalize text-muted-foreground">
            {task.dt_start ? format(new Date(task.dt_start), "MMM yyyy", { locale: Locale }) : ""}
          </span>
        </div>

        {/* Contenu */}
        <div className="flex min-w-0 flex-1 flex-col">

          <div className="flex-1">
            {/* Title */}
            <p className="mb-1 text-base font-semibold capitalize">
              {`${t("common.maintenance")} - ${equipment.name || equipment.model || "Unknown"}`}
            </p>




          </div>

          <div className="mr-2 flex items-center gap-1">
            <TagIcon
              size={12}
              className="text-muted-foreground"
            />
            <span className="flex-1 truncate text-xs font-medium capitalize text-muted-foreground">
              {task ? task.typeFamily : "Unknown"}
            </span>
          </div>

          <span className="mt-1 truncate text-xs font-medium capitalize text-muted-foreground">
            {task ? formatRelative(new Date(task.dt_start), new Date(), { locale: Locale }) : ""}
          </span>
        </div>


        {/* Watermark icon */}
        <div className="absolute -bottom-10 -right-10 opacity-[0.08]">
          {task.bike ? (
            <Bike size={110} className="text-chart-1" />
          ) : (
            <Wrench size={110} className="text-chart-1" />
          )}
        </div>
      </Card>
    </button>
  );
};