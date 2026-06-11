import { getExtLocalLanguage } from "../i18n/utils";
import type { LocationObject } from "./map";

/**
 * Calculates the distance in meters between two geographic coordinates using the Haversine formula.
 *
 * @param lat1 - Latitude of the first point in decimal degrees.
 * @param lon1 - Longitude of the first point in decimal degrees.
 * @param lat2 - Latitude of the second point in decimal degrees.
 * @param lon2 - Longitude of the second point in decimal degrees.
 * @returns The distance between the two points in meters.
 */
const getDistanceInMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance en mètres
};
/**
 * Calculates the total cumulative distance in meters
 * along an array of LocationObjects (from index 0 to the last point).
 */
const getTotalDistanceInMeters = (coords: LocationObject[]): number => {
  if (coords.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += getDistanceInMeters(
      coords[i - 1].coords.latitude,
      coords[i - 1].coords.longitude,
      coords[i].coords.latitude,
      coords[i].coords.longitude,
    );
  }
  return total;
};

const findClosestSegmentIndex = (
  coordinates: LocationObject[],
  tapped: [number, number],
): number => {
  let closestIndex = 0;
  let minDist = Infinity;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const a = coordinates[i];
    const b = coordinates[i + 1];
    // Distance du point tapé au milieu du segment
    const midLng = (a.coords.longitude + b.coords.longitude) / 2;
    const midLat = (a.coords.latitude + b.coords.latitude) / 2;
    const dist = Math.hypot(tapped[0] - midLng, tapped[1] - midLat);
    if (dist < minDist) {
      minDist = dist;
      closestIndex = i;
    }
  }
  return closestIndex;
};

const distance = (a: [number, number], b: [number, number]) => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
};

const formatDistance = (distance: number | string) => {
  const meters = Number(distance);
  if (!Number.isFinite(meters)) return "0 m";

  const isKm = meters >= 1000;
  const value = Math.round((isKm ? meters / 1000 : meters) * 100) / 100; // Arrondi à 2 décimales
  const langue = getExtLocalLanguage();

  const formatter = new Intl.NumberFormat(langue, {
    style: "unit",
    unit: isKm ? "kilometer" : "meter",
    minimumFractionDigits: isKm ? 2 : 0,
    maximumFractionDigits: isKm ? 2 : 0,
  });

  return formatter.format(value);
};
const formatDistanceByHour = (speedInKmPerHour: number | string): string => {
  speedInKmPerHour = Number(speedInKmPerHour);
  if (Number.isNaN(speedInKmPerHour) || speedInKmPerHour === 0) {
    return "0 km/h";
  }

  return `${speedInKmPerHour.toFixed(1)} km/h`;
};

const getDistanceFromRoute = (routeCoordinates: [number, number][]): number => {
  let totalDistance = 0;
  for (let i = 1; i < routeCoordinates.length; i++) {
    const [lon1, lat1] = routeCoordinates[i - 1];
    const [lon2, lat2] = routeCoordinates[i];
    totalDistance += getDistanceInMeters(lat1, lon1, lat2, lon2);
  }
  return totalDistance;
};

/**
 * @param distanceInMeters - distance en mètres
 * @param speedKmh - vitesse moyenne personnalisée en km/h
 * @returns durée en secondes
 */
const estimateCyclingDuration = (
  distanceInMeters: number,
  speedKmh: number,
): number => {
  if (!distanceInMeters || !speedKmh) return 0;
  const distanceKm = distanceInMeters / 1000;
  const durationHours = distanceKm / speedKmh;
  return Math.round(durationHours * 3600);
};




const INTERVALS: number = 5000;
const DISTANCE_INTERVAL: number = 15; // mètres
const INITIAL_LOCATION: LocationObject = {
  coords: {
    latitude: 43.6,
    longitude: 1.433333,
    altitude: null,
    accuracy: 5,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: Date.now(),
};
const MIN_DISTANCE = 5; // mètres
const getDistance = (a: LocationObject["coords"], b: LocationObject["coords"]) => {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;

  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const x =
    dLon * Math.cos((lat1 + lat2) / 2);

  return Math.sqrt(dLat * dLat + x * x) * R;
};

const getDistanceFromWaypoints = (waypoints: LocationObject[]): number => {
  let totalDistance = 0;
  for (let i = 1; i < waypoints.length; i++) {
    totalDistance += getDistance(waypoints[i - 1].coords, waypoints[i].coords);
  }
  return totalDistance;
};


export {
  getDistanceInMeters,
  formatDistance,
  formatDistanceByHour,
  getDistanceFromRoute,
  getDistanceFromWaypoints,
  estimateCyclingDuration,
  findClosestSegmentIndex,
  getTotalDistanceInMeters,
  MIN_DISTANCE,
  INITIAL_LOCATION,
  INTERVALS,
  DISTANCE_INTERVAL,
  getDistance,
  distance,
};
