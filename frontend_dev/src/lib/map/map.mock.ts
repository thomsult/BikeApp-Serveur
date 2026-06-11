// __mocks__/map.ts
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

export const mockPositions = [
  { latitude: 43.60827049112127, longitude: 1.405979207798638 },
  { latitude: 43.60910535742222, longitude: 1.406219279880552 },
  { latitude: 43.60927537654165, longitude: 1.406481630317427 },
  { latitude: 43.60992120940585, longitude: 1.405686848053365 },
  { latitude: 43.60973577968188, longitude: 1.405324764769329 },
  { latitude: 43.60853366330962, longitude: 1.405042148421924 },
  { latitude: 43.60827049112127, longitude: 1.405979207798638 }, // retour au départ
];

const makeLocationObject = (lat: number, lng: number) => ({
  coords: {
    latitude: lat,
    longitude: lng,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: 1.5,
  },
  timestamp: Date.now(),
});

export const requestForegroundPermissionsAsync = async () => ({
  status: "granted" as const,
});



export const getCurrentPositionAsync = async (
  options?: PositionOptionsProps
): Promise<LocationObject> =>
  makeLocationObject(mockPositions[0].latitude, mockPositions[0].longitude);

const easeInOut = (t: number): number => {
  return t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t;
};

const interpolateEaseInOut = (
  positions: { latitude: number; longitude: number }[],
  steps: number = 20
) => {
  const result: { latitude: number; longitude: number }[] = [];

  for (let i = 0; i < positions.length - 1; i++) {
    const from = positions[i];
    const to = positions[i + 1];

    for (let s = 0; s < steps; s++) {
      const t = easeInOut(s / steps);
      result.push({
        latitude: from.latitude + (to.latitude - from.latitude) * t,
        longitude: from.longitude + (to.longitude - from.longitude) * t,
      });
    }
  }

  result.push(positions[positions.length - 1]);
  return result;
};

export const watchPositionAsync = async (
  options: any,
  onUpdate: (location: any) => void
) => {
  // const smoothPositions = interpolateEaseInOut(mockPositions, 10);
  let index = 0;

  const interval = setInterval(() => {
    // const pos = smoothPositions[index % smoothPositions.length];
    const pos = mockPositions[index % mockPositions.length];
    onUpdate(makeLocationObject(pos.latitude, pos.longitude));
    index++;
  }, 3000); // 100ms × 20 steps = ~2s par segment

  return { remove: () => clearInterval(interval) };
};