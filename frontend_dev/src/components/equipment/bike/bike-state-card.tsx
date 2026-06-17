import LabelBadge from "@/components/ui/label-badge";
import { getUploadedFileUrl } from "@/lib/api/common/client";
import type { Bike, ComponentBike } from "@/lib/api/equipments/bike";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const placeHolderImage =
  "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1080&fit=max&auto=format&dpr=2";

const BikeComponent = ({ component }: { component: ComponentBike }) => {
  const { t } = useTranslation();
  const componentBrand = component.brand.label ?? t("common.untitled");
  const componentType = component.type.label ?? t("common.unknown_type");

  return (
    <LabelBadge
      type={
        component.status > 50
          ? "success"
          : component.status > 20
            ? "warning"
            : "error"
      }
      size="small"
      text={`${componentType} ${componentBrand}`}
    />
  );
};

export const StateCard = ({
  bike,
  onClick,
}: {
  bike: Partial<Bike>;
  onClick?: () => void;
}) => {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState<string>(placeHolderImage);

  useEffect(() => {
    if (bike.image && typeof bike.image === "string") {
      getUploadedFileUrl("/" + bike.image)
        .then((url) => setImageUrl(url))
        .catch(() => setImageUrl(placeHolderImage));
    } else {
      setImageUrl(placeHolderImage); // 🔥 IMPORTANT
    }
  }, [bike.image]);

  const bikeStatus = useMemo(() => {
    if (typeof bike.status === "number") {
      if (bike.status >= 80) return "excellent";
      if (bike.status >= 50) return "good";
      if (bike.status >= 20) return "fair";
      return "poor";
    }
    return bike.status;
  }, [bike.status]);

  const statusBadgeType =
    bikeStatus === "excellent"
      ? "success"
      : bikeStatus === "good"
        ? "warning"
        : "error";

  const bikeTypeName = bike.type?.label;

  return (
    <button
      type="button"
      key={bike.id}
      className="overflow-hidden rounded-2xl bg-card border w-full text-left transition-transform active:scale-[0.99]"
      onClick={onClick}
    >
      {/* Image with overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          loading="lazy"
          src={imageUrl}
          alt={bike.name}
          className="w-full h-full object-cover"
        />



        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">

          {bikeTypeName && (
            <LabelBadge
              size="small"
              text={bikeTypeName}
              type="outlined"

            />
          )}

          {bike.preferred && (
            <div className="flex items-center gap-1 ml-auto">
              <StarFilledIcon className="text-yellow-400 w-3 h-3" />
              <span className="text-xs font-medium text-white  mix-blend-difference">
                {t("common.bike_preference")}
              </span>
            </div>
          )}
        </div>

        {/* Bottom: name + status */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xl font-semibold text-white mb-1.5 leading-tight">
            {bike.name}
          </p>
          <LabelBadge
            size="small"
            text={
              bikeStatus
                ? t(`common.bike_status.${bikeStatus}`)
                : t("common.unknown_status")
            }
            type={statusBadgeType}
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Stats grid */}
        {bike.stats && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-muted/50 rounded-xl px-3 py-2.5">
              <p className="text-base font-semibold leading-tight">
                {bike.stats.distance > 0 ? bike.stats.distance : "--"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 capitalize leading-tight">
                {t("common.stats.unit_distance", {
                  unit: t("common.units.distance"),
                })}
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl px-3 py-2.5">
              <p className="text-base font-semibold leading-tight">
                {bike.stats.rides > 0 ? bike.stats.rides : "--"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 capitalize leading-tight">
                {t("common.stats.rides", { count: bike.stats.rides })}
              </p>
            </div>

            {bike.stats.lastService && <div className="bg-muted/50 rounded-xl px-3 py-2.5">
              <p className="text-base font-semibold leading-tight">
                {new Date(bike.stats.lastService).toLocaleDateString()}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 capitalize leading-tight">
                {t("common.stats.last_maintenance")}
              </p>
            </div>}
          </div>
        )}

        {/* Components */}
        <div className="border-t border-border/50 pt-3">
          {bike.components && bike.components.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {bike.components.slice(0, 3).map((component) => (
                <BikeComponent key={component.id} component={component} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {t("app.equipment.accessories.emptyTitle")}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};