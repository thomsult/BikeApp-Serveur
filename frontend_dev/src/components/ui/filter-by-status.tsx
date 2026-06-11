import type { ActivityMaintenanceT } from "@/lib/api/activity/activity";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import LabelBadge from "./label-badge";

export const FilterByStatus = ({
  maintenanceTasks,
  onPress,
  totalLength,
}: {
  maintenanceTasks: ActivityMaintenanceT[];
  onPress: (status: "upcoming" | "overdue" | "completed" | "all") => void;
  totalLength: number;
}) => {
  const { t } = useTranslation();
  const filteredTasks = useMemo(() => {
    const currentDate = new Date();
    return {
      upcoming: maintenanceTasks.filter(
        (task) => !task.completedAt && new Date(task.dt_start) > currentDate,
      ),
      overdue: maintenanceTasks.filter(
        (task) => !task.completedAt && new Date(task.dt_start) <= currentDate,
      ),
      completed: maintenanceTasks.filter((task) => task.completedAt),
    };
  }, [maintenanceTasks]);
  return (
    <div className="flex flex-row items-center gap-2">
      {filteredTasks.upcoming.length > 0 && (
        <button
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onPress("upcoming")}>
          <LabelBadge
            text={
              t("common.filters.upcoming") +
              ` (${filteredTasks.upcoming.length})`
            }
            size="extraSmall"
            type="info"
          />
        </button>
      )}
      {filteredTasks.overdue.length > 0 && (
        <button
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onPress("overdue")}>
          <LabelBadge
            text={`${t("common.filters.overdue")} (${filteredTasks.overdue.length})`}
            size="extraSmall"
            type="error"
          />
        </button>
      )}
      {filteredTasks.completed.length > 0 && (
        <button
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onPress("completed")}>
          <LabelBadge
            text={
              t("common.filters.completed") +
              ` (${filteredTasks.completed.length})`
            }
            size="extraSmall"
            type="success"
          />
        </button>
      )}
      <button
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => onPress("all")}>
        <LabelBadge
          text={`${t("common.filters.all")} (${totalLength})`}
          size="extraSmall"
          type="muted"
        />
      </button>
    </div>
  );
};