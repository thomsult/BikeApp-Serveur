import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAllBikes } from "@/lib/api/equipments";
import type { Bike } from "@/lib/api/equipments/bike";
import { Button } from "../ui/button";
import { BikeIcon, PlusIcon } from "lucide-react";
import { EmptyStateCard } from "./bike/empty-bike-state-card";
import { StateCard } from "./bike/bike-state-card";
import useHandleDeepLink from "@/lib/hooks/use-handle-deep-link";
import { BikeModal } from "./bike-modal";

const UsePaginatedBikes = (bikes: Partial<Bike>[]) => {
  const [showAllBike, setShowAllBike] = useState(false);
  const primaryBike = useMemo(() => {
    if (bikes.length === 0) return null; // Chercher d'abord le vélo préféré
    const preferredBike = bikes.find((bike) => bike.preferred);
    if (preferredBike) return preferredBike;

    // Sinon, prendre le plus récent par date
    const sortedBikes = [...bikes].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Du plus récent au plus ancien
    });

    return sortedBikes[0];
  }, [bikes]);

  const displayedBikes = useMemo(() => {
    if (showAllBike) return bikes;
    return primaryBike ? [primaryBike] : [];
  }, [showAllBike, bikes, primaryBike]);
  return { displayedBikes, showAllBike, setShowAllBike };
};

export const BikeView = () => {
  const { t } = useTranslation();
  const { data: bikes = [] } = useAllBikes();
  const { displayedBikes, showAllBike, setShowAllBike } =
    UsePaginatedBikes(bikes);

  const [showModal, setShowModal] = useState<
    (Partial<Bike> & { refer?: string }) | null
  >(null);

  const { navigate, resetNavigate } = useHandleDeepLink<
    Partial<Bike> & {
      refer?: string,
    }
  >({
    originalPath: "/equipment",
    path: "bike-modal",
    show: (newActivity) => {
      console.info("Deep link received for bike modal:", newActivity);
      if (newActivity["bike-modal"] === "new") {
        delete newActivity["bike-modal"];
        setShowModal({ ...newActivity });
      } else {
        setShowModal(
          bikes?.find((bike) => bike.id === newActivity["bike-modal"]) ?? null,
        );
      }
    },
    hide: () => setShowModal(null),
  });

  const handleNewBikeClick = useCallback(() => {
    navigate({ id: "new" } as Bike);
  }, [navigate]);

  const handleBikeClick = useCallback((bike: Partial<Bike>) => {
    navigate({ id: bike.id } as Bike);
  }, [navigate]);



  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <p className="text-lg font-bold">
          {bikes.length === 0
            ? t("app.equipment.bikes.title_zero")
            : bikes.length === 1
              ? t("app.equipment.bikes.title_one")
              : t("app.equipment.bikes.title")}
        </p>
        {bikes.length > 0 && (
          <Button
            variant="ghost"
            onClick={handleNewBikeClick}
          >
            <PlusIcon size={18} className="text-primary" />
            <p className="font-semibold text-primary">
              {t("app.equipment.bikes.addBike")}
            </p>
          </Button>
        )}
      </div>

      {bikes.length === 0 ? (
        <EmptyStateCard
          icon={BikeIcon}
          title={t("app.equipment.bikes.emptyTitle")}
          description={t("app.equipment.bikes.emptyDescription")}
          buttonText={t("app.equipment.bikes.addBike")}
          onClick={handleNewBikeClick}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {displayedBikes.map((bike) => (
            <StateCard
              key={bike.id}
              bike={bike}
              onClick={() => handleBikeClick(bike)}
            />
          ))}

          {bikes.length > 1 && (
            <button
              type="button"
              onClick={() => setShowAllBike((v) => !v)}
              className="bg-card w-full mb-3 flex-row items-center justify-center rounded-lg p-3" >
              <p className="text-sm font-medium text-primary">
                {showAllBike
                  ? t("common.showLess")
                  : `${t("common.showMore")} (${bikes.length - 1} ${t(
                    bikes.length > 1 ? "common.bikes" : "common.bike",
                  )})`}
              </p>
            </button>
          )}
        </div>
      )}
      {showModal && <BikeModal showModal={showModal} hideModal={resetNavigate} />}
    </>
  );
};
