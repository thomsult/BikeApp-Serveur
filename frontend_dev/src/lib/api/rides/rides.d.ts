import type { LocationObject } from "expo-location";
import type { WeatherInfo } from "@/lib/weather/weather";
import type { DateTimeString, UUIDString } from "../types";

export interface Ride {
  id: UUIDString;
  name: string;
  date: DateTimeString;
  distance: number | string;
  duration: number | string;
  avgSpeed: number;
  maxSpeed: number;
  startTime?: DateTimeString;
  endTime?: DateTimeString;

  image?: string;

  weather?: WeatherInfo;
  waypoints: LocationObject[];
  memo?: string;
  shareLink?: string;
  createdAt?: DateTimeString;
  updatedAt?: DateTimeString;
}
