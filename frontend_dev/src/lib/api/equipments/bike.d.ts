import type { BikeResource, ComponentsBrand, ComponentsResource, ComponentsType, GetApiBikesTypesByTypeBikeResponse, TypeBike } from "@/client";
import { type ID } from "../types";

export type ComponentBikeType = ComponentsType
export type ComponentBikeBrand = ComponentsBrand
export type ComponentBike = ComponentsResource

export type FileUpload = {
  file?: File;
  base64?: string;
};
type url = string;

export type Bike = BikeResource;

export type BikeType = TypeBike

export type BikeStats = BikeResource["stats"];

export type Service = BikeResource["stats"]["service"];
