import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAllBikes, useComponentBike } from "@/lib/api/equipments";
import type { Bike, ComponentBike } from "@/lib/api/equipments/bike";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LabelBadge from "@/components/ui/label-badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, WrenchIcon } from "lucide-react";
import type { BikeAccessoriesContextType } from "../bike-accessories-context";

const useAssignedCountBike = (componentId: string, enabled: boolean) => {
  const { data: bikes } = useAllBikes({ enabled });

  const memoizedCount = useMemo(() => {
    return (
      bikes?.filter((bike) =>
        bike.components.some((component) => component.id === componentId),
      ).length || 0
    );
  }, [bikes, componentId]);

  return memoizedCount;
};

interface AccessoriesCardProps {
  bike?: BikeAccessoriesContextType["bike"];
  onClick?: () => void;
  item: ComponentBike['id'];
}

export const AccessoriesCard = ({
  item,
  onClick,
  bike,
}: AccessoriesCardProps) => {
  const { t } = useTranslation();
  const assignedCount = useAssignedCountBike(item, bike === undefined);
  const { data: component } = useComponentBike(item, { enabled: !!item });
  console.log(component);
  return (
    <button
      className="w-full text-left"
      style={{ opacity: 1 }}
      onMouseDown={(e) => (e.currentTarget.style.opacity = "0.7")}
      onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      onClick={onClick}
    >
      <Card className="relative h-46 overflow-hidden rounded-2xl  pt-3"
      >
        {/* Icône watermark */}
        <div className="absolute -bottom-4 -right-4" style={{ opacity: 0.05 }}>
          <WrenchIcon size={80} className="text-primary" />
        </div>


        <CardHeader className="mt-2">
          <CardTitle>
            <p
              className="text-base"
            >
              {component?.brand?.label || t("common.untitled")}
              <span className="text-sm font-light text-muted-foreground">
                {" - "}{component?.model || "Modèle inconnu"}
              </span>
            </p>
          </CardTitle>

          <LabelBadge
            text={component?.type?.label || t("common.unknown_type")}
            size="small"
            type="info"
            className="mb-auto mt-1 self-start max-w-xs"
          />
        </CardHeader>

        <CardContent className="relative flex justify-between">
          {bike === undefined && (
            <p
              className="text-xs text-muted"

            >
              {t("common.assignedTo", {
                count: assignedCount,
                field: t("common.bike", { count: assignedCount }),
              })}
            </p>
          )}

          {bike !== undefined && (
            <div className="w-full">
              <div className="mb-1 flex flex-row justify-between">
                <p className="text-xs font-light ">
                  État
                </p>
                <p className="text-xs font-bold text-primary">
                  {component?.status}%
                </p>
              </div>
              <Progress value={component?.status} />
            </div>
          )}
        </CardContent>

        {component?.createdAt && <CardFooter className="flex flex-row items-center gap-1 ">

          <Calendar size={10} />
          <p className="text-xs ">
            {component?.createdAt ? new Date(component.createdAt).toLocaleDateString() : ""}
          </p>
        </CardFooter>}
      </Card>
    </button>
  );
};