import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { MapPinIcon, MapPinOffIcon } from "lucide-react";
import { ActivityIndicator } from "../ui/activity-indicator";
import { alertsConfirmation } from "../alerts";
import { useCenterUserLocation, useLocationStore } from "@/lib/map/use-location-store";
import { useTrackingUser } from "@/lib/map/use-tracking-user";



export const UserLocationButton = () => {
  const {
    isTrackingEnabled,
    toggleTracking,
  } = useTrackingUser();
  const { loading, error } = useLocationStore();
  const centerOnUserLocation = useCenterUserLocation();

  // ✅ Centre automatiquement dès qu'on a une vraie position après activation
  useEffect(() => {
    const triggerCentering = async () => {
      if (isTrackingEnabled) {
        centerOnUserLocation();
      }
      if (error) {
        console.error("Error while tracking user location:", error);
        return await alertsConfirmation({
          title: "Location Tracking Error",
          message: "An error occurred while trying to track your location. Please check your permissions and try again.",
          button: {
            cancel: "Cancel",
          },
        });
      }
    };
    triggerCentering();

  }, [isTrackingEnabled, loading, error]);


  const isDisabled = !!error || loading;





  return <Card
    title={isTrackingEnabled ? "Stop Tracking" : "Start Tracking"}
    className={
      cn(
        "p-4 flex items-center justify-center rounded-lg flex-col",
        "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
        "cursor-pointer",
        isTrackingEnabled && !isDisabled ? "text-primary" : "text-gray-500",
      )
    }
    onClick={toggleTracking}
  >
    {!loading ?
      isTrackingEnabled && !isDisabled ? <MapPinIcon size={34} /> :

        <MapPinOffIcon
          className={
            cn(
              "transition-colors",
              "text-gray-500",
              isDisabled ? "opacity-50 pointer-events-none hover:bg-none " : ""
            )
          }
          size={34}
        /> : <ActivityIndicator size="lg" />}
  </Card>;
};


