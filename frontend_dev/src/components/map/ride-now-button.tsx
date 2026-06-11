
import { BikeIcon } from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { ActivityIndicator } from "../ui/activity-indicator";
import { RIDE_STATUS, useRideDispatch, useRideStore, type RideStatus } from "../rides/rides-context";
import { useNavigate } from "@tanstack/react-router";
import { useLocationStore } from "@/lib/map/use-location-store";

export const RideNowButton = () => {
  const isRiding = useRideStore((state) => (state.isRiding));
  const isPaused = useRideStore((state) => (state.isPaused));
  const { checkIfCanStartRide } = useRideDispatch({});
  const loading = useLocationStore((state) => state.loading);
  const error = useLocationStore((state) => state.error);
  const router = useNavigate();
  const isDisabled = !!error || loading;

  const toggleRideNow = async () => {
    const check = await checkIfCanStartRide();
    if (!check || isDisabled) {
      console.warn("Cannot start ride now:", check);
      return;
    }

    let actions: RideStatus = RIDE_STATUS.STOP;
    if (!isRiding && !isPaused) {
      actions = RIDE_STATUS.PLAY;
    } if (isRiding && isPaused) {
      actions = RIDE_STATUS.PLAY;
    }
    else if (isRiding && !isPaused) {
      actions = RIDE_STATUS.PAUSE;
    } else if (isPaused) {
      actions = RIDE_STATUS.PLAY;
    }
    router({
      from: "/ride",
      to: "/ride",
      search: { id: "new", actions: actions },
      replace: true,
    })
  }
  const colorRide = isDisabled ? "text-gray-400" : isRiding && !isPaused ? "text-primary" : isPaused ? "text-success" : "text-gray-500";

  return (<Card
    title={isRiding && !isPaused ? "Stop Ride" : "Start Ride"}
    className={
      cn(
        "p-4 flex items-center justify-center rounded-lg flex-col",
        "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
        "cursor-pointer",
        colorRide,
      )
    }
    onClick={toggleRideNow}
  >
    {!loading ? <BikeIcon
      className={
        cn(
          "transition-colors",
          colorRide,
        )
      }

      size={28}
    /> : <ActivityIndicator size="lg" />}
  </Card>);
};
