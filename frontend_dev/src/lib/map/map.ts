// map.ts
export type LocationObject = {
  coords: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitudeAccuracy?: number | null;
    altitude?: number | null;
    heading?: number | null;
    speed?: number | null;
  };
  timestamp: number;
};

export const Accuracy = {
  Lowest: "lowest",
  Low: "low",
  Balanced: "balanced",
  High: "high",
  Highest: "highest",
} as const;

export type AccuracyLevel = typeof Accuracy[keyof typeof Accuracy];
export interface PositionOptionsProps {
  accuracy?: AccuracyLevel;
  timeInterval?: number;
  distanceInterval?: number;
}

export interface LocationSubscription {
  remove: () => void;
}


export const requestForegroundPermissionsAsync = async (): Promise<{
  status: "granted" | "denied";
}> => {
  if (!navigator.geolocation) {
    return { status: "denied" };
  }

  try {
    await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true),
        (error) => reject(error)
      );
    });
    return { status: "granted" };
  } catch (e) {
    return { status: "denied" };
  }
};

export const getCurrentPositionAsync = async (
  options?: PositionOptionsProps
): Promise<LocationObject> => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position as LocationObject),
      (error) => reject(error),
      {
        enableHighAccuracy: options?.accuracy === Accuracy.High || options?.accuracy === Accuracy.Highest,
        timeout: options?.timeInterval,
        maximumAge: options?.distanceInterval,
      }
    );
  });
};

export const watchPositionAsync = async (
  options: PositionOptionsProps,
  onUpdate: (location: LocationObject) => void
): Promise<{ remove: () => void }> => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported");
  }


  const watchId = navigator.geolocation.watchPosition(
    (position) => onUpdate(position as LocationObject),
    (error) => console.error("Error watching position:", error),
    {
      enableHighAccuracy: options?.accuracy === Accuracy.High || options?.accuracy === Accuracy.Highest,
      timeout: options?.timeInterval,
      maximumAge: options?.distanceInterval,
    }
  );

  return {
    remove: () => navigator.geolocation.clearWatch(watchId),
  };
};

