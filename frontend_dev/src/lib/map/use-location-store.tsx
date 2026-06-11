import { create } from "zustand";
import type { LocationObject } from "./map";
import { useMap } from "react-map-gl/mapbox";
import { useCallback } from "react";

type LocationState = {
  location: LocationObject | null;
  setLocation: (loc: LocationObject) => void;
  error: string | null;
  loading: boolean;
};

const useLocationStore = create<LocationState>((set, get) => ({
  location: null,
  setLocation: (loc) => set({ location: loc }),
  error: null,
  loading: false,
}));



const useCenterUserLocation = () => {
  const { current: map } = useMap();
  const location = useLocationStore(state => state.location);

  const centerOnUserLocation = useCallback((immediate: boolean = false, zoom: number = 16) => {
    if (!map || !location) return;

    // Optionnel mais recommandé
    if (!map.isStyleLoaded()) return;

    map.flyTo({
      center: [
        location.coords.longitude,
        location.coords.latitude,
      ],
      zoom,
      duration: immediate ? 0 : 800,
      essential: true,
    });
  },
    [map, location]
  );

  return centerOnUserLocation;

};



export { useLocationStore, useCenterUserLocation };
