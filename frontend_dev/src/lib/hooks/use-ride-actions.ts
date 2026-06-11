import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDrawingRoute } from "@/lib/map/use-drawing-route";
import {
  useCreateActivity,
  useDeleteActivity,
  useUpdateActivity,
} from "../api/activity";
import type { ActivityRideT } from "../api/activity/activity";
import { Alert } from "../notification/alert-context";

export const useRideActions = () => {
  const { t } = useTranslation();
  const { mutateAsync: createRideAsync } = useCreateActivity();
  const { mutateAsync: updateRideAsync } = useUpdateActivity();
  const { mutateAsync: deleteRideAsync } = useDeleteActivity();
  const { resetCoordinate } = useDrawingRoute();
  const normalizeRideData = (
    data: Partial<ActivityRideT>,
  ): Partial<ActivityRideT> => ({
    ...data,
    avgSpeed: Math.round((data.avgSpeed ?? 0) * 100) / 100,
    maxSpeed: Math.round((data.maxSpeed ?? 0) * 100) / 100,
    distance: Math.round((Number(data.distance) ?? 0) * 100) / 100,
  });
  const [isLoading, setIsLoading] = useState(false);
  const saveRide = useCallback(
    async (data: Partial<ActivityRideT>) => {
      if (!data) return;
      console.log("Saving ride with data", data);
      const normalized = normalizeRideData(data);
      setIsLoading(true);
      try {
        if (normalized.id && normalized.id !== "") {
          return await updateRideAsync({
            ...normalized,
            updatedAt: new Date().toISOString(),
          } as ActivityRideT);
        } else {
          return await createRideAsync({
            ...normalized,
            title: normalized.title ?? "",
          } as ActivityRideT);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [createRideAsync, updateRideAsync],
  );

  const confirmEndRide = useCallback(
    async (onSave: () => void) => {
      const confirm = await Alert.alert(
        t("components.activities.saveRideConfirmationTitle"),
        t("components.activities.saveRideConfirmation"),
        {
          cancel: t("common.actions.cancel"),
          confirm: t("common.actions.save"),
        })
      if (confirm) {
        setIsLoading(true);
        try {
          await onSave();
        } finally {
          setIsLoading(false);
        }
      }
      else {
        resetCoordinate();

      }
    },
    [t, resetCoordinate],
  );

  const confirmDeleteRide = useCallback(
    async (data: Partial<ActivityRideT>) => {
      const confirm = await Alert.alert(
        t("components.activities.deleteRideConfirmationTitle"),
        t("components.activities.deleteRideConfirmation"),
        {
          cancel: t("common.actions.cancel"),
          confirm: t("common.actions.delete"),
        })
      if (confirm) {
        if (!data) return;
        setIsLoading(true);
        try {
          return await deleteRideAsync(data as ActivityRideT);
        }
        finally {
          setIsLoading(false);
        }
      }

    },
    [t, deleteRideAsync],
  );

  const confirmWithOutSaving = useCallback(
    async () => {
      return await Alert.alert(
        t("components.activities.ExitRideConfirmationTitle"),
        t("components.activities.ExitRideConfirmation"),
        {
          cancel: t("common.actions.cancel"),
          confirm: t("common.actions.confirm"),
        })
    },
    [t],
  );



  const notFound = useCallback(async () => {
    await Alert.alert(
      t("components.activities.rideNotFound"),
      "",
      {
        cancel: "",
        confirm: t("common.actions.ok"),
      }
    );
  }, [t]);

  return {
    saveRide,
    confirmEndRide,
    confirmDeleteRide,
    confirmWithOutSaving,
    notFound,
    isLoading,
  };
};
