import { isBefore, isPast, isSameDay, isSameMonth } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { useAllActivities } from "@/lib/api/activity";
import type { Activity } from "@/lib/api/activity/activity";
import { useAllTypeActivities } from "@/lib/api/type-activity";
import useHandleDeepLink from "@/lib/hooks/use-handle-deep-link";
import { ActivityCard } from "./activitie-card";
import { EmptyActivityView } from "./empty-activity-view";
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { CellDate } from "../calendar/calendar.dt";
import { useRouter } from "@tanstack/react-router";
import { formatDateDisplay, formatMonthDisplay } from "../calendar/calendar-utils";
import { FilterByStatus } from "../ui/filter-by-status";
import ActivitiesModal from "./activites-modal";
import { useAllBikes } from "@/lib/api/equipments";
import { alertsConfirmation } from "../alerts";
import { useHandleActivity } from "./use-handle-activity";

export const ActivityView = ({
  selectedDate,
  selectedMonth,
}: {
  selectedDate: CellDate;
  selectedMonth: Date;
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState<
    (Activity & { refer?: string }) | null
  >(null);
  const [showAll, setShowAll] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "upcoming" | "overdue" | "completed" | "all"
  >("all");

  const { data: activities } = useAllActivities();

  const { navigate, resetNavigate } = useHandleDeepLink<Activity>({
    originalPath: "/calendar",
    path: "activity-modal",
    show: async (newActivity) => {

      if (newActivity["activity-modal"] === "new") {
        delete newActivity["activity-modal"];
        setModalVisible(newActivity);
      } else {
        const activity = activities?.find(
          (act) => act.id === newActivity["activity-modal"],
        );
        if (!activity) {
          window.alert(t("components.activities.activityNotFound"));
          return;
        }
        if (activity.typeFamily === "ride") {
          return handleActivity(activity);
        }
        setModalVisible({
          ...activity,
          refer: newActivity.refer,
          ...newActivity.extraParams,
        });
      }
    },
    hide: () => setModalVisible(null),
  });

  const monthDisplay = !selectedDate.date && selectedMonth;

  const getActivitiesToDisplay = useMemo(() => {
    if (!activities) return [];
    if (monthDisplay) {
      return activities.filter((activity) =>
        isSameMonth(new Date(activity.dt_start), selectedMonth),
      );
    }
    return activities.filter((activity) =>
      isSameDay(new Date(activity.dt_start), selectedDate.date!),
    );
  }, [activities, selectedDate, selectedMonth, monthDisplay]);

  useEffect(() => {
    setShowAll(false);
  }, [selectedDate, selectedMonth]);

  const isPastDate = () => {
    if (isSameDay(selectedDate.date ?? selectedMonth, new Date())) return false;
    return isPast(selectedDate.date ?? selectedMonth);
  };

  const { handleNewActivity, handleActivity } = useHandleActivity();

  const sortedActivities = useMemo(() => {
    return getActivitiesToDisplay
      .sort(
        (a, b) =>
          new Date(a.dt_start).getTime() - new Date(b.dt_start).getTime(),
      )
      .filter((task) => {
        const now = new Date();
        const taskDate = new Date(task.dt_start);
        if (filterStatus === "upcoming") return !task.completedAt && taskDate > now;
        if (filterStatus === "overdue") return !task.completedAt && taskDate <= now;
        if (filterStatus === "completed") return task.completedAt;
        return true;
      });
  }, [getActivitiesToDisplay, filterStatus]);

  const displayedActivities = showAll
    ? sortedActivities
    : sortedActivities.slice(0, 3);
  const hasMore = sortedActivities.length > 3;

  return (
    <div className="flex flex-col gap-0">
      <Card>
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-border px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <CalendarIcon size={20} className="text-foreground" />
            <span className="text-xl font-bold capitalize">
              {monthDisplay
                ? isSameMonth(selectedMonth, new Date())
                  ? t("components.activities.month")
                  : t("components.activities.default", {
                    date: formatMonthDisplay(selectedMonth),
                  })
                : formatDateDisplay(selectedDate)}
            </span>
          </div>
          <span className="rounded-full bg-background px-2 py-1 text-xs font-semibold text-muted-foreground">
            {sortedActivities.length || 0}
          </span>
        </div>

        {/* Filtres */}

        <div className="flex -mt-2 items-center border-b border-border px-6 pb-4">
          <span className="mr-4 mt-0.5 text-xs font-medium text-muted-foreground">
            {t("common.filter")}:
          </span>
          <FilterByStatus
            maintenanceTasks={sortedActivities}
            onPress={setFilterStatus}
            totalLength={getActivitiesToDisplay?.length || 0}
          />

        </div>


        {/* Contenu */}
        <div className="px-5 py-3">
          {sortedActivities.length > 0 ? (
            <>
              {displayedActivities
                .sort((a, b) =>
                  isBefore(new Date(a.dt_start), new Date(b.dt_start)) ? -1 : 1,
                )
                .map((activity, index) => (
                  <ActivityCard
                    key={`${activity.id}-${index}`}
                    activity={activity}
                    onPress={() => handleActivity(activity)}
                    last={index === displayedActivities.length - 1}
                  />
                ))}

              {hasMore && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg pb-2 pt-4 text-xs font-medium text-primary transition-opacity hover:opacity-70"
                >
                  {showAll
                    ? t("common.showLess")
                    : `${t("common.showMore")} (${sortedActivities.length - 3})`}
                  {showAll
                    ? <ChevronUpIcon size={14} />
                    : <ChevronDownIcon size={14} />}
                </button>
              )}
            </>
          ) : (
            <p className="pb-4 text-center text-muted-foreground">
              {monthDisplay
                ? t("components.activities.noActivitiesMonth")
                : t("components.activities.noActivitiesDay")}
            </p>
          )}

          {isPastDate() ? (
            <p className="mt-4 rounded-lg border-2 border-dashed border-destructive bg-destructive/10 p-4 text-center text-muted-foreground">
              {t("components.activities.pastDate")}!!
            </p>
          ) : (
            <div className="mt-4">
              <EmptyActivityView handleNewActivity={() => {
                handleNewActivity(selectedDate.date);
              }} />
            </div>
          )}
        </div>

        <ActivitiesModal
          showModal={modalVisible as any}
          hideModal={resetNavigate}
        />
      </Card>

      {/* Equivalent insets.bottom */}
    </div>
  );
};