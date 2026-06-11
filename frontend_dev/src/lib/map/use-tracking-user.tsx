import { create } from "zustand";
import { useUserLocationContinuous } from "./use-user-location";
import { useEffect } from "react";

interface TrackingState {
  isTrackingEnabled: boolean;
  toggleTracking: () => void;
  startTracking: () => void;
  stopTracking: () => void;
  error: string | null;
  loading: boolean;
}
const getInitialTracking = () => {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("mapTrackingEnabled") === "true";
};
export const useTrackingUser = create<TrackingState>((set, get) => ({
  isTrackingEnabled: getInitialTracking(),
  error: null,
  loading: false,
  toggleTracking: () => {
    const { isTrackingEnabled, startTracking, stopTracking } = get();
    if (isTrackingEnabled) {
      stopTracking();
    } else {
      startTracking();
    }
  },
  startTracking: () => {
    sessionStorage.setItem("mapTrackingEnabled", "true");
    set({ isTrackingEnabled: true });
  },
  stopTracking: () => {
    sessionStorage.setItem("mapTrackingEnabled", "false");
    set({ isTrackingEnabled: false });
  },
}));

export const useTrackingSync = () => {
  const { isTrackingEnabled } = useTrackingUser((s) => s);
  const { startLocationUpdates, stopLocationUpdates } =
    useUserLocationContinuous();

  useEffect(() => {
    if (isTrackingEnabled) {
      startLocationUpdates();
    } else {
      stopLocationUpdates();
    }
  }, [isTrackingEnabled, startLocationUpdates, stopLocationUpdates]);
};