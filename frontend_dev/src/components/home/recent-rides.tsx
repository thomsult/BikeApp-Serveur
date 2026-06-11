import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAllActivitiesRides } from "@/lib/api/activity";
import type { ActivityRideT } from "@/lib/api/activity/activity";
import TitlesSection from "../ui/titles-section";
import RideCard from "../rides/ride-card";

const MAX_RIDES = 3;

const EmptyState = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center  p-4">
      <p className="text-sm text-muted-foreground">
        {t("common.none_female", {
          item: t("app.home.recentRides.title").toLocaleLowerCase(),
        })}
      </p>
    </div>
  );
};

const RidesList = ({ rides }: { rides: ActivityRideT[] }) =>
  rides.length === 0 ? (
    <EmptyState />
  ) : (
    <div className="flex flex-col gap-2">
      {rides.map((ride) => (
        <RideCard key={ride.id} ride={ride} />
      ))}
    </div>
  );

const RidesPagination = ({
  total,
  displayed,
  onShowAll,
  showAll,
}: {
  total: number;
  displayed: number;
  onShowAll: (show: boolean) => void;
  showAll: boolean;
}) => {
  const { t } = useTranslation();

  if (total <= displayed) return null;

  return (
    <button
      onClick={() => onShowAll(!showAll)}
      className="mt-2 w-full text-center text-[13px] text-muted-foreground transition-opacity hover:opacity-70"
    >
      {showAll
        ? t("common.showLess")
        : t("common.andMore", {
          count: total - displayed,
          item: t("app.home.recentRides.title", {
            count: total - displayed,
          }).toLocaleLowerCase(),
        })}
    </button>
  );
};

const RecentRides: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const { data: rides = [], isLoading } = useAllActivitiesRides();
  const { t } = useTranslation();

  const ridesFiltered = rides.filter(
    (ride) => new Date(ride.dt_start) <= new Date(),
  );

  const displayedRides = showAll
    ? ridesFiltered
    : ridesFiltered.slice(0, MAX_RIDES);

  return (
    <div className="flex flex-col gap-2">
      <TitlesSection
        title={
          t("app.home.recentRides.title", { count: ridesFiltered.length }) +
          (ridesFiltered.length > 0 ? ` (${ridesFiltered.length})` : "")
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center  p-4">
          <p className="text-sm text-muted-foreground">
            {t("common.loading")}
          </p>
        </div>
      ) : (
        <RidesList rides={displayedRides} />
      )}

      {ridesFiltered.length > MAX_RIDES && (
        <RidesPagination
          total={ridesFiltered.length}
          displayed={MAX_RIDES}
          onShowAll={setShowAll}
          showAll={showAll}
        />
      )}
    </div>
  );
};

export default RecentRides;