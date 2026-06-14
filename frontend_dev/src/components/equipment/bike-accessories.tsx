import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAllBikes, useAllComponentBikes } from "@/lib/api/equipments";
import type {
  Bike,
  ComponentBike,
  ComponentBikeType,
} from "@/lib/api/equipments/bike";
import { Toast } from "@/lib/notification/toast-context";
import BikeAccessoriesContext from "./bike-accessories-context";
import { AccessoriesBikeList } from "./equipment/accessorie-bike-list";
import { SearchAccessoriesInput } from "../ui/search-accessories-input";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";

const BikeModalAccessories = ({
  bike,
  onChange,
}: {
  bike?: Bike;
  onChange?: (components: ComponentBike[]) => void;
}) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<ComponentBikeType["label"] | "all">(
    "all",
  );
  const [selectedItem, setSelectedItem] = useState<ComponentBike | null>(null);
  const global = bike === undefined;
  const { data: equipments = [] } = useAllComponentBikes();
  const { data: bikes = [] } = useAllBikes();
  const bikeIsSelected = !!bike;
  const equipmentsMap: ComponentBike[] = useMemo(() => {
    return [
      ...equipments
        .filter((component) =>
          category === "all" ? true : component.type.label === category,
        )
        .filter((component) => {
          if (!bikeIsSelected) return true; // If no bike is selected, show all components
          if (bikes) {
            return bikes.every((bike) => {
              if (!bike.components) return true;
              return !bike.components.some(
                (c) => !c.multiBike && c.id === component.id,
              );
            });
          }
          return true;
        })
        .filter((component) => {
          if (!bikeIsSelected) return true; // If no bike is selected, show all components
          if (bike?.components?.length) {
            return !bike.components.some((c) => c.id === component.id);
          }
          return true;
        }),
    ];
  }, [equipments, category, bikeIsSelected, bikes, bike]);

  const addBikeComponent = (component: ComponentBike | null) => {
    if (!component || !bike) return;
    if (bike.components?.find((c) => c.id === component.id)) {
      return Toast.error({
        title: t("components.accessories.existing"),
        message: t("components.accessories.existingDescription"),
      });
    } else if (
      bikes.some((b) => b.components?.find((c) => c.id === component.id)) &&
      !component.multiBike
    ) {
      return Toast.error({
        title: t("components.accessories.used"),
        message: t("components.accessories.usedDescription"),
      });
    }

    onChange?.([...(bike.components || []), component]);
  };
  const removeBikeComponent = (componentId: string) => {
    if (!bike || !bike.components) return;

    onChange?.([...bike.components].filter((c) => c.id !== componentId));
  };
  const updateBikeComponent = (component: ComponentBike) => {
    if (!bike || !bike.components) return;

    onChange?.(
      bike.components.map((c) => (c.id === component.id ? component : c)),
    );
  };

  return (
    <BikeAccessoriesContext.Provider
      value={{
        bike,
        bikes: bikes,
        equipments: equipmentsMap,
      }}
    >
      <>
        <SearchAccessoriesInput
          global={global}
          components={equipmentsMap}

          onSelect={(component) => {
            console.log("Selected component:", component);
            setCategory(component.type.label);
            setSelectedItem(component);
          }}
          onReset={() => {
            setSelectedItem(null);
            setCategory("all");
          }}
        />
      </>
      {selectedItem && !global ? (
        <div className="flex items-center justify-end gap-2 w-full p-2 -mt-2">
          <Button
            variant={"tertiary"}
            className="flex-1 justify-start"
            onClick={() => {
              addBikeComponent(selectedItem);
              setSelectedItem(null);
            }}
          >
            <PlusIcon className="mr-2  " />
            {t("common.actions.add")}
          </Button>

        </div>
      ) : null}


      <AccessoriesBikeList
        addBikeComponent={addBikeComponent}
        removeBikeComponent={removeBikeComponent}
        updateBikeComponent={updateBikeComponent}
      />
    </BikeAccessoriesContext.Provider>
  );
};

export default BikeModalAccessories;
