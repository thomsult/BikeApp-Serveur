import type { Activity } from "@/lib/api/activity/activity";
import { useAllTypeActivities } from "@/lib/api/type-activity";
import { useSelectedLanguage } from "@/lib/i18n/language-context";
import { TagIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTimeDisplay } from "../calendar/calendar-utils";
import { getExtLocalLanguage } from "@/lib/i18n/utils";

export const ActivityCard = ({
  activity,
  onPress,
  last = false,
}: {
  activity: Activity;
  onPress: () => void;
  last?: boolean;
}) => {
  const { data: typeActivities } = useAllTypeActivities();
  const typeActivity = typeActivities?.find((type) => type.id === activity.type);
  const language = getExtLocalLanguage();

  const month = activity.dt_start
    ? new Date(activity.dt_start).toLocaleDateString(language, { month: "long" })
    : "";

  const displayDate = activity.dt_start
    ? formatDateTimeDisplay(activity.dt_start, language) +
    (activity.dt_end ? ` - ${formatDateTimeDisplay(activity.dt_end, language)}` : "")
    : "";

  return (
    <button
      onClick={onPress}
      className={cn(
        "my-2 flex w-full items-center gap-0 text-left",
        !last && "border-b border-border pb-3",
      )}
    >
      {/* Date badge */}
      <div className="mr-4 flex shrink-0 flex-col items-center justify-center rounded-lg bg-primary/20 p-2">
        <span className="text-2xl font-bold">
          {activity.dt_start ? new Date(activity.dt_start).getDate() : ""}
        </span>

        <span className="text-center text-xs font-medium capitalize text-muted-foreground">
          {month}
        </span>
      </div>

      {/* Contenu */}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="flex-1 truncate text-lg font-semibold capitalize">
          {activity.title}
        </span>

        <div className="mr-2 flex items-center gap-1">
          <TagIcon
            size={12}
            style={{ color: typeActivity ? typeActivity.color : undefined }}
            className={!typeActivity ? "text-muted-foreground" : ""}
          />
          <span className="flex-1 truncate text-xs font-medium capitalize text-muted-foreground">
            {typeActivity ? typeActivity.label : "Unknown"}
          </span>
        </div>

        <span className="mt-1 truncate text-xs font-medium capitalize text-muted-foreground">
          {displayDate}
        </span>
      </div>

      {/* Chevron */}
      <ChevronRightIcon size={14} className="shrink-0 text-muted-foreground" />
    </button>
  );
};