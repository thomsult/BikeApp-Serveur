import { formatRelative } from "date-fns";
import { enGB, fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import type { ActivityRideT } from "@/lib/api/activity/activity";
import { getExtLocalLanguage } from "@/lib/i18n/utils";

import { ChevronRightIcon } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useHandleActivity } from "../activities/use-handle-activity";

const Stat = <T,>({
  value,
  evalValue,
  empty,
}: {
  value: T | null;
  evalValue: (value: T) => string;
  empty: string;
}) => (
  <span
    className={`max-w-[80px] truncate text-sm font-bold ${value ? "text-foreground" : "text-muted-foreground"
      }`}
  >
    {value ? evalValue(value) : empty}
  </span>
);

const RideCard = ({ ride }: { ride: ActivityRideT }) => {
  const { t } = useTranslation();
  const langue = getExtLocalLanguage();
  const locale = langue === "fr" ? fr : enGB;
  const { handleActivity } = useHandleActivity();

  return (
    <button
      onClick={() => handleActivity(ride)}
      className="group relative flex w-full overflow-hidden rounded-2xl bg-card text-left transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <img
        src="assets/images/play_store_512.png"
        alt=""
        className="h-32 w-32 shrink-0 object-cover"
      />

      {/* Contenu */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <p className="mb-0.5 text-base font-bold">
          {ride.title || t("common.untitled")}
        </p>

        <p className="text-[13px] capitalize text-muted-foreground">
          {formatRelative(new Date(ride.dt_start), new Date(), { locale })}
        </p>

        <div className="flex gap-4">
          <Stat
            value={ride.distance}
            // evalValue={(d) => formatDistance(d || 0)}
            evalValue={(d) => `${((d || 0) / 1000).toFixed(2)} km`}
            empty={t("common.fields.no_distance")}
          />
          <Stat
            value={ride.duration}
            // evalValue={(d) => formatTime(d || 0)}
            evalValue={(d) => {
              const hours = Math.floor((d || 0) / 3600);
              const minutes = Math.floor(((d || 0) % 3600) / 60);
              return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
            }}
            empty={t("common.fields.no_duration")}
          />
        </div>
      </div>

      {/* Chevron */}
      <div className="absolute bottom-0 right-4 top-0 flex items-center">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
          <ChevronRightIcon size={14} className="text-primary" />
        </div>
      </div>
    </button>
  );
};

export default RideCard;