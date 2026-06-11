

import { useRideActions } from "./use-ride-actions";
import type { ActivityRideT } from "../api/activity/activity";
import { useCallback, useState } from "react";
import { useAllActivitiesRides } from "../api/activity";
import { useTranslation } from "react-i18next";
import { alertsConfirmation } from "@/components/alerts";
import useHandleDeepLink from "./use-handle-deep-link";
import type { RideStatus } from "@/components/rides/rides-context";

type ViewState =
  | { type: "idle"; }
  | { type: "ride_now"; data?: Partial<ActivityRideT>; actions?: RideStatus }
  | { type: "save_ride"; data?: Partial<ActivityRideT>; };


export const useRideNavigation = () => {

  const [viewState, setViewState] = useState<ViewState>({ type: "idle" });
  const { t } = useTranslation();
  const { data: rideData, refetch } = useAllActivitiesRides();

  const clearView = useCallback(() => setViewState({ type: "idle" }), []);


  const {
    saveRide,
    confirmEndRide,
    confirmDeleteRide,
    confirmWithOutSaving,
    isLoading,
    notFound
  } = useRideActions();






  const showRideNow = useCallback(
    (actions?: RideStatus, data?: Partial<ActivityRideT>) => {
      setViewState({ type: "ride_now", actions, data });
    },
    [],
  ); // ✅ Aucune dépendance instable



  const findExistingRide = useCallback(
    (id: string) => {
      return rideData?.find((ride) => ride.id === id);
    },
    [rideData],
  );

  const handleExistingRide = useCallback(
    (id: string) => {
      const data = findExistingRide(id);
      if (!data) {

        return notFound();
      }
      setViewState({ type: "save_ride", data });
    },
    [findExistingRide, notFound],
  );
  const handleExistingRideNow = useCallback(
    async (id: string, status?: RideStatus) => {
      return new Promise<void>((resolve) => {
        try {
          setImmediate(() => {
            const data = findExistingRide(id);

            if (!data) {
              throw new Error("Ride not found");
            }

            showRideNow(status, data);
          });
        } catch (error) {
          notFound();
        } finally {
          resolve();
        }
      });
    },
    [findExistingRide, notFound, showRideNow],
  );

  const handleStartRide = useCallback((data: Partial<ActivityRideT>) => {
    setViewState((prev) => ({
      type: "save_ride",
      data,
    }));

  }, []);

  const showView = useCallback(async (params: any) => {

    if (params.id === "new") {
      showRideNow(params.actions, {} as Partial<ActivityRideT>);
    }
    else if (params.id && params.id !== "new" && params.actions) {
      await handleExistingRideNow(params.id, params.actions);
    }

    else if (params.id && params.id !== "new" && !params.actions) {
      console.info("Handling deep link for existing ride with id:", params.id);
      handleExistingRide(params.id);
    } else {
      console.warn("Showing ride bottom sheet with no id and no new action", {
        params,
      });
    }
  }, [handleExistingRide, handleExistingRideNow, showRideNow]);

  const handleEndRide = useCallback((data: Partial<ActivityRideT>) => {
    if (data?.distance && data.distance > 0) {
      confirmEndRide(() => {
        clearView();
        setViewState({ type: "save_ride", data });
      });
    }
  }, [confirmEndRide]);


  useHandleDeepLink({
    originalPath: "/ride",
    path: 'id',
    show: showView,
    hide: clearView,
  });



  return {
    viewState,
    actions: {
      handleStartRide,
      confirmEndRide,
      confirmDeleteRide,
      confirmWithOutSaving,
      saveRide: async (data: Partial<ActivityRideT>) => {
        setViewState({ type: "save_ride", data: await saveRide(data) });
      },
      handleEndRide
    },
    isLoading,
  };
};