import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAllActivities } from "@/lib/api/activity";
import type { ActivityMaintenanceT } from "@/lib/api/activity/activity";
import { useAllTypeActivities } from "@/lib/api/type-activity";
import LabelBadge from "../ui/label-badge";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { EquipmentMaintenanceCard } from "./equipment/maintenance-card";
import { EmptyEquipmentMaintenanceCard } from "./equipment/empty-maintenance-card";


const MAXLENGTH_DISPLAYED = 1;

const useEquipmentMaintenancePagination = (
  showAll: boolean,
  filterStatus: "upcoming" | "overdue" | "completed" | "all",
) => {
  const { data: activities = [] } = useAllActivities();
  const { data: activitiesType = [] } = useAllTypeActivities();

  const activityTypeMaintenance = activitiesType.find(
    (type) => type.family === "maintenance",
  );

  const maintenanceTasksNoFiltered: ActivityMaintenanceT[] = activities.filter(
    (task) => task.type === activityTypeMaintenance?.id,
  );

  const maintenanceTasks = useMemo(() => {
    return maintenanceTasksNoFiltered
      .filter((task) => {
        const currentDate = new Date();
        const taskDate = new Date(task.dt_start);
        if (filterStatus === "upcoming") {
          return !task.completedAt && taskDate > currentDate;
        } else if (filterStatus === "overdue") {
          return !task.completedAt && taskDate <= currentDate;
        } else if (filterStatus === "completed") {
          return task.completedAt;
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(a.dt_start).getTime() - new Date(b.dt_start).getTime(),
      );
  }, [maintenanceTasksNoFiltered, filterStatus]);

  const tasksFiltered = useMemo(() => {
    return maintenanceTasks.slice(
      0,
      showAll ? maintenanceTasks.length : MAXLENGTH_DISPLAYED,
    );
  }, [maintenanceTasks, showAll]);

  return {
    maintenanceTasks,
    tasksFiltered,
    totalLength: maintenanceTasksNoFiltered.length,
    activityTypeMaintenance,
  };
};

import { useCallback } from "react";

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
  const handleUpcoming = useCallback(() => onPress("upcoming"), [onPress]);
  const handleOverdue = useCallback(() => onPress("overdue"), [onPress]);
  const handleCompleted = useCallback(() => onPress("completed"), [onPress]);
  const handleAll = useCallback(() => onPress("all"), [onPress]);

  return (
    <div className="flex flex-row items-center gap-2">
      {filteredTasks.upcoming.length > 0 && (
        <button onClick={handleUpcoming}>
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
        <button onClick={handleOverdue}>
          <LabelBadge
            text={`${t("common.filters.overdue")} (${filteredTasks.overdue.length})`}
            size="extraSmall"
            type="error"
          />
        </button>
      )}
      {filteredTasks.completed.length > 0 && (
        <button onClick={handleCompleted}>
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
      <button onClick={handleAll}>
        <LabelBadge
          text={`${t("common.filters.all")} (${totalLength})`}
          size="extraSmall"
          type="muted"
        />
      </button>
    </div>
  );
};

export const EquipmentMaintenanceView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "upcoming" | "overdue" | "completed" | "all"
  >("all");

  const {
    maintenanceTasks,
    tasksFiltered,
    totalLength,
    activityTypeMaintenance,
  } = useEquipmentMaintenancePagination(showAll, filterStatus);

  return (
    <>
      <p
        className="text-lg font-bold"
      >
        {t("components.activities.maintenanceToBeScheduled")}
      </p>

      {totalLength > 0 && <FilterByStatus
        maintenanceTasks={maintenanceTasks}
        onPress={setFilterStatus}
        totalLength={totalLength}
      />}

      <div className="flex flex-col gap-3">
        {tasksFiltered.map((task) => (
          <EquipmentMaintenanceCard
            key={task.id}
            task={task}
            handleClick={() =>
              navigate({
                to: "/calendar",
                search: {
                  "activity-modal": task.id,
                  refer: "equipment",
                },
              })
            }
          />
        ))}

        {activityTypeMaintenance && (
          <EmptyEquipmentMaintenanceCard
            text={t("components.activities.scheduleMaintenance")}
            handleClick={() =>
              navigate({
                to: "/calendar",
                search: {
                  "activity-modal": "new",
                  type: activityTypeMaintenance.id,
                  refer: "equipment",
                },
              })
            }
          />
        )}

        {!activityTypeMaintenance && (
          <EmptyEquipmentMaintenanceCard
            text={t("components.activities.noActivityTypeTitleMaintenance")}
            handleClick={() => navigate({
              to: "/calendar",
              search: {
                "activity-type-modal": "new",
                family: "maintenance",
                refer: "equipment",
              },
            })
            }
          />
        )}

        {maintenanceTasks.length > MAXLENGTH_DISPLAYED && (
          <button
            onClick={useCallback(() => setShowAll((v) => !v), [])}
            className="flex flex-row items-center justify-center rounded-lg p-2 bg-card hover:bg-card/80 self-center"
          >
            <p
              className="mr-2 text-sm font-medium text-primary"
            >
              {showAll
                ? t("common.showLess")
                : `${t("common.showMore")} (${maintenanceTasks.length - MAXLENGTH_DISPLAYED})`}
            </p>
            {showAll ? (
              <ChevronUp
                size={16}
                className="text-primary"
              />
            ) : (
              <ChevronDown
                size={16}
                className="text-primary"
              />
            )}
          </button>
        )}
      </div>
    </>
  );
};