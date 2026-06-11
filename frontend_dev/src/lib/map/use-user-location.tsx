import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Location from "./map";
import { Marker } from "mapbox-gl";
import { useMap, type MapRef } from "react-map-gl/mapbox";
import { useLocationStore } from "@/lib/map/use-location-store";
import { getDistance } from "./utils";
import { useTrackingUser } from "./use-tracking-user";

export const useUserLocationContinuous = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const setLocation = useLocationStore((state) => state.setLocation);

  const startLocationUpdates = useCallback(async () => {
    if (subscriptionRef.current) return;
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission refusée");
      }

      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
        },
        (loc) => {
          const prev = useLocationStore.getState().location;
          if (prev) {
            const distance = getDistance(prev.coords, loc.coords);
            if (distance < 5) return;
          }
          setLocation(loc);
        }
      );
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Erreur localisation");
    } finally {
      setLoading(false);
    }
  }, [setLocation]); // ✅ ajout de setLocation dans les deps

  const stopLocationUpdates = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      subscriptionRef.current?.remove();
    };
  }, []);

  return useMemo(
    () => ({ error, loading, startLocationUpdates, stopLocationUpdates }),
    [error, loading, startLocationUpdates, stopLocationUpdates]
  );
};

export const MarkerUserLocation = () => {
  const { current: map } = useMap();

  useEffect(() => {
    if (!map) return;

    const el = document.createElement("div");
    const inner = document.createElement("div");
    inner.className =
      "size-5 relative bg-blue-500 rounded-full border-2 border-white";

    const ping = document.createElement("div");
    ping.className =
      "animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75";
    inner.appendChild(ping);
    el.appendChild(inner);

    const marker = new Marker({ element: el });

    const onZoom = () => {
      const scale = Math.max(0.5, Math.min(2, map.getZoom() / 14));
      inner.style.transform = `scale(${scale})`;
    };
    onZoom();
    map.on("zoom", onZoom);

    // ✅ Pas de hook dans useEffect — accès direct au store Zustand

    const updateMarker = () => {
      const { location, loading, error } = useLocationStore.getState();
      const { isTrackingEnabled } = useTrackingUser.getState();
      const shouldShow = isTrackingEnabled && !!location && !loading && !error;

      if (shouldShow) {
        marker
          .setLngLat([location!.coords.longitude, location!.coords.latitude])
          .addTo(map.getMap()); // ✅ map.getMap() retourne le MapboxMap natif attendu par Marker
      } else {
        marker.remove();
      }
    };

    updateMarker();

    const unsubLocation = useLocationStore.subscribe(updateMarker);
    // ✅ abonnement au store tracking aussi pour réagir aux changements
    const unsubTracking = useTrackingUser.subscribe(updateMarker);

    return () => {
      map.off("zoom", onZoom);
      unsubLocation();
      unsubTracking();
      marker.remove();
    };
  }, [map]); // ✅ map en dépendance

  return null;
};