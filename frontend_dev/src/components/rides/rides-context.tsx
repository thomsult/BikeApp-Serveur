import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useTranslation } from "react-i18next";
import type { ActivityRideT } from "@/lib/api/activity/activity";
import { useAllBikes } from "@/lib/api/equipments";
import { useAllTypeActivities } from "@/lib/api/type-activity";
import {
  useUserLocationContinuous,
} from "@/lib/map/use-user-location";
import { DISTANCE_INTERVAL, getDistanceInMeters } from "@/lib/map/utils";

import type { Bike } from "@/lib/api/equipments/bike";
import { alertsConfirmation } from "../alerts";
import { useLocationStore } from "@/lib/map/use-location-store";
import { useTrackingUser } from "@/lib/map/use-tracking-user";
import { useDrawingRoute } from "@/lib/map/use-drawing-route";

import { create } from "zustand";

export const RIDE_STATUS = {
  PLAY: "play",
  PAUSE: "pause",
  STOP: "stop",
} as const;

export type RideStatus = (typeof RIDE_STATUS)[keyof typeof RIDE_STATUS];

interface WeatherInfo {
  temperature?: number;
  condition?: string;
  iconUrl?: string;
}
type WeatherInfoState = { weather?: WeatherInfo | undefined };
export interface RideState extends ActivityRideT, WeatherInfoState {
  isRiding: boolean;
  isPaused: boolean;
  elapsedTime: number;
  currentSpeed: number;
  avgSpeed: number;
  weather?: WeatherInfo;
  rideState: RideStatus;

}
interface RideStore extends RideState {
  start: (payload?: Partial<ActivityRideT>) => void;
  pause: () => void;
  stop: () => void;
  tick: (payload: { currentSpeed?: number; distance?: number; avgSpeed?: number; duration?: number }) => void;
}

const initialState: RideState = {
  id: "new",
  isRiding: false,
  isPaused: false,
  elapsedTime: 0,
  distance: 0,
  currentSpeed: 0,
  avgSpeed: 0,
  title: "",
  duration: 0,
  maxSpeed: 0,
  bike: undefined,
  description: "",
  type: "",
  typeFamily: "ride",
  dt_start: "",
  recurrence: null,
  startedAt: undefined,
  stoppedAt: undefined,
  rideState: RIDE_STATUS.STOP,
  waypoints: [],

};



export const useRideStore = create<RideStore>((set) => ({
  ...initialState,
  rideState: (initialState.isRiding ? RIDE_STATUS.PLAY : RIDE_STATUS.STOP) as RideStatus,

  // actions
  start: (payload) =>
    set(() => ({
      ...payload,
      isRiding: true,
      isPaused: false,
      startedAt: new Date().toISOString(),
      rideState: RIDE_STATUS.PLAY,
    })),

  pause: () =>
    set((s) => ({
      isPaused: !s.isPaused,
      rideState: !s.isPaused ? RIDE_STATUS.PAUSE : RIDE_STATUS.PLAY,
    })),

  stop: () =>
    set(() => ({
      ...initialState,
      rideState: RIDE_STATUS.STOP,
    })),

  tick: ({ currentSpeed, distance = 0, duration = 0 }) =>
    set((s) => {
      const newDistance = (s.distance || 0) + distance;
      const newDuration = (s.duration || 0) + duration;

      return {
        distance: newDistance,
        duration: newDuration,
        currentSpeed: currentSpeed ?? s.currentSpeed,
        avgSpeed: newDistance / newDuration,
        maxSpeed: Math.max(s.maxSpeed || 0, currentSpeed ?? 0),
      };
    }),
}));



export const RidesProvider = ({ children }: { children: React.ReactNode }) => {
  const { isPaused, isRiding, tick } = useRideStore();
  // Centralisation de la route ici

  // Location tracking centralisé
  const { error, startLocationUpdates } =
    useUserLocationContinuous();

  const { liveCoordinates, setLiveCoordinates } = useDrawingRoute();

  // Démarrer le tracking de localisation quand la course commence
  useEffect(() => {
    if (isRiding && !isPaused) {
      startLocationUpdates();
    }
  }, [isRiding, isPaused, startLocationUpdates]);


  useEffect(() => {
    if (!isRiding || isPaused || error) return;

    const interval = setInterval(() => {
      const location = useLocationStore.getState().location;

      if (!location) return;

      const lastPoint =
        liveCoordinates.length > 0
          ? liveCoordinates[liveCoordinates.length - 1]
          : location;

      const currentDistance = getDistanceInMeters(
        lastPoint.coords.latitude,
        lastPoint.coords.longitude,
        location.coords.latitude,
        location.coords.longitude,
      );

      if (liveCoordinates.length === 0) {
        setLiveCoordinates([location]);
        return;
      }

      if (currentDistance < DISTANCE_INTERVAL) {
        tick({
          currentSpeed: location.coords.speed ?? 0,
          distance: 0,
          avgSpeed: 0,
          duration: 1,
        });
        return;
      }

      const speed = location.coords.speed ?? 0;


      setLiveCoordinates([...liveCoordinates, location]);
      tick({
        currentSpeed: location.coords.speed ?? 0,
        distance: currentDistance,
        avgSpeed: speed,
        duration: 1,
      });

    }, 1000);

    return () => clearInterval(interval);
  }, [
    isRiding,
    isPaused,
    error,
    liveCoordinates,
  ]);

  return children;
};

interface RideDispatchProps {
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onRestart?: () => void;
}

export const useRideDispatch = ({
  onStart,
  onPause,
  onReset,
  onRestart,
}: RideDispatchProps) => {
  const { start, stop, pause } = useRideStore()
  const { t } = useTranslation();
  // const { data: dataWeather, refetch } = useWeatherQuery({
  //   enabled: false,
  // });
  const {
    isTrackingEnabled,
  } = useTrackingUser();
  const { data: bikes } = useAllBikes();
  const { data: activitiesType } = useAllTypeActivities();



  const handlePressWhenTrackingDisabled = useCallback(() => {
    return alertsConfirmation({
      title: t("app.rides.tracking_disabled_title"),
      message: t("app.rides.tracking_disabled_message"),
      button: {
        confirm: t("common.actions.ok"),
      }
    });
  }, [t]);

  const handlePressWhenNoBike = useCallback(() => {
    return alertsConfirmation({
      title: t("app.rides.no_bike_title"),
      message: t("app.rides.no_bike_message"),
      button: {
        confirm: t("common.actions.ok"),
      }
    });
  }, [t]);

  const handlePressWhenNoTypeRide = useCallback(() => {
    return alertsConfirmation({
      title: t("app.rides.no_type_ride.title"),
      message: t("app.rides.no_type_ride.message"),
      button: {
        confirm: t("common.actions.ok"),
      }
    });
  }, [t]);


  const checkIfCanStartRide = useCallback(async () => {
    if (!isTrackingEnabled) {
      return !await handlePressWhenTrackingDisabled();
    }
    const bikePreferred = bikes?.find((b) => b.preferred);

    if (!bikePreferred && bikes && bikes.length === 0) {
      return !await handlePressWhenNoBike();
    }

    const typeRide = activitiesType?.find((t) => t.family === "ride");
    if (!typeRide) {
      return !await handlePressWhenNoTypeRide();
    }

    return true;
  }, [handlePressWhenNoBike, handlePressWhenNoTypeRide, handlePressWhenTrackingDisabled, isTrackingEnabled]);

  const handleStart = useCallback(
    async (data: Partial<ActivityRideT>) => {
      let newData = { ...data };

      const canStart = await checkIfCanStartRide();
      if (!canStart) return;

      if (!newData.bike) {
        const bikePreferred = bikes?.find((b) => b.preferred);

        if (bikePreferred) {
          newData.bike = bikePreferred as Bike;
        } else if (bikes && bikes.length > 0) {
          newData.bike = bikes[0] as Bike;
        }
      }

      newData.typeFamily = "ride";

      newData.dt_start = new Date().toISOString();
      newData.dt_end = undefined;
      newData.distance = 0;
      newData.duration = 0;
      newData.avgSpeed = 0;
      newData.maxSpeed = 0;
      newData.title = new Date().toLocaleDateString();
      newData.description = "";


      onStart?.();
      start(newData);

    },
    [
      start,
      onStart,
      bikes,
      activitiesType,
      isTrackingEnabled,
      handlePressWhenNoBike,
      handlePressWhenNoTypeRide,
      handlePressWhenTrackingDisabled,
    ]
  );
  // try {
  //   // const weatherData = dataWeather ?? (await refetch()).data;
  //   const weatherData = undefined; // TODO: fetch weather data
  //   dispatch({
  //     type: "SET_WEATHER",
  //     payload: { weather: weatherData ?? {} },
  //   });
  // } catch (error) {
  //   console.error("Erreur lors de la récupération de la météo:", error);
  //   dispatch({
  //     type: "SET_WEATHER",
  //     payload: { weather: {} },
  //   });
  // }

  const handlePause = useCallback(() => {
    pause();
    onPause?.();
  }, [pause, onPause]);

  const handleReset = useCallback(() => {

    stop();
    onReset?.();
  }, [stop, onReset]);

  const handleRestart = useCallback(() => {
    pause();
    onRestart?.();
  }, [start, onRestart]);

  return { handleStart, handlePause, handleReset, handleRestart, checkIfCanStartRide };
};
