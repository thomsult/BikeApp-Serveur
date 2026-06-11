import { useContext, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

// import { AccessoriesBikeModal } from "./accessorie-bike-modal";
import { AccessoriesCard } from "./accessorie-card";
import {
  EmptyAccessoriesCard,
  EmptyAccessoriesCardAlt,
} from "./empty-accessories-card";
import type { ComponentBike } from "@/lib/api/equipments/bike";
import BikeAccessoriesContext from "../bike-accessories-context";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { AccessoriesBikeModal } from "./accessorie-bike-modal";

interface AccessoriesBikeListProps {
  onDeleteComponentOnBike?: (componentId: string) => void;
  addBikeComponent?: (component: ComponentBike) => void;
  removeBikeComponent?: (componentId: string) => void;
  updateBikeComponent?: (component: ComponentBike) => void;
}

const MAXLENGTH_DISPLAYED = 3;

export const AccessoriesBikeList = ({
  addBikeComponent,
  removeBikeComponent,
  updateBikeComponent,
}: AccessoriesBikeListProps) => {
  const { t } = useTranslation();
  const { bike, equipments } = useContext(BikeAccessoriesContext);

  const [showModal, setShowModal] = useState<ComponentBike | null>(null);
  const [showAll, setShowAll] = useState(false);

  const hideModalWithAction = useCallback(
    (
      action:
        | "createComponentBike"
        | "updateComponentBike"
        | "deleteComponentBike"
        | "cancel",
      component: ComponentBike | null,
    ) => {
      if (action === "cancel") {
        setShowModal(null);
        return;
      }
      if (action === "createComponentBike") {
        if (component && addBikeComponent) {
          addBikeComponent(component);
        }
      } else if (action === "updateComponentBike") {
        if (component && updateBikeComponent) {
          updateBikeComponent(component);
        }
      } else if (action === "deleteComponentBike") {
        if (component && removeBikeComponent) {
          removeBikeComponent(component.id);
        }
      }
      setShowModal(null);
    },
    [addBikeComponent, removeBikeComponent, updateBikeComponent],
  );

  const handleOpenModal = useCallback((component: ComponentBike | null) => setShowModal(component), []);

  const handleAddNew = useCallback(() => setShowModal({} as ComponentBike), []);

  const toggleShowAll = useCallback(() => setShowAll((v) => !v), []);

  const equipmentsLength = Object.entries(
    bike ? bike.components || {} : equipments || {},
  ).length;

  const displayedEquipments = bike
    ? showAll
      ? bike?.components
      : Object.fromEntries(
        Object.entries(bike?.components || {}).slice(0, MAXLENGTH_DISPLAYED),
      )
    : showAll
      ? equipments
      : Object.fromEntries(
        Object.entries(equipments || {}).slice(0, MAXLENGTH_DISPLAYED),
      );

  return (
    <>
      <div className="flex w-full flex-row flex-wrap justify-between gap-3">
        {Object.entries(displayedEquipments || {}).map(([key, item]) => (
          <div key={key} className="relative w-[48%]">
            <AccessoriesCard
              bike={bike}
              onClick={() => handleOpenModal(item)}
              item={item}
            />

            {bike && (
              <button
                className="absolute right-2 top-2 rounded-full p-1 bg-card"
                onClick={() => hideModalWithAction("deleteComponentBike", item)}
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}

        <div className="min-w-[48%] flex-1">
          {Object.values(displayedEquipments || {}).length === 0 ? (
            <EmptyAccessoriesCard
              onClick={handleAddNew}
            />
          ) : (
            <EmptyAccessoriesCardAlt
              onClick={handleAddNew}
            />
          )}
        </div>
      </div>

      {equipmentsLength > MAXLENGTH_DISPLAYED && (
        <button
          onClick={toggleShowAll}
          className="mt-3 bg-card  flex flex-row items-center justify-center rounded-lg p-3"
        >
          <p
            className="mr-2 text-sm font-medium text-primary"

          >
            {showAll
              ? t("common.showLess")
              : t("common.showMore") +
              ` (${equipmentsLength - MAXLENGTH_DISPLAYED})`}
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

      <AccessoriesBikeModal
        bike={bike}
        showModal={showModal}
        hideModalWithAction={hideModalWithAction}
      />
    </>
  );
};