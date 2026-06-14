import { type ID } from "../types";

export type ComponentBikeType = {
  id: ID;
  label: string;
  createdAt?: DateTimeString;
  updatedAt?: DateTimeString;
};

export type ComponentBikeBrand = {
  id: ID;
  label: string;
  createdAt?: DateTimeString;
  updatedAt?: DateTimeString;
};

export interface ComponentBike {
  id: ID;
  type: ComponentBikeType;
  brand: ComponentBikeBrand;
  status: number; // percentage for wear level
  model: string;
  multiBike?: boolean; // indicates if the component can be used on multiple bikes
  createdAt?: DateTimeString;
  updatedAt?: DateTimeString;
}

export type FileUpload = {
  file?: File;
  base64?: string;
};
type url = string;

export interface Bike {
  id: ID;
  name: string;
  preferred: boolean;
  type: BikeType;
  status: number; // percentage for wear level or string for condition
  image: FileUpload | url | null; // URL of the bike image, can be null if no image is set
  components: ComponentBike[];
  stats: BikeStats;
  createdAt?: DateTimeString;
  updatedAt?: DateTimeString;
}

export type BikeType = {
  id: ID;
  label: string;
  createdAt?: DateTimeString;
  updatedAt?: DateTimeString;
};

export interface BikeStats {
  distance: number;
  rides: number;
  lastService: DateTimeString | null;
  service: Service;
  createdAt?: DateTimeString;
  updatedAt?: DateTimeString;
}

export type Service = {
  method:
  | "useLastServiceDate"
  | "distanceInterval"
  | "timeInterval"
  | "ridesInterval"
  | "none"
  | "manual";
  intervalDistance?: number;
  intervalTime?: number; // in days
  intervalRides?: number;
  manualNote?: string | null;
};
