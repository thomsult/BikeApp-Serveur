import { createContext } from "react";
import type { Bike, ComponentBike } from "@/lib/api/equipments/bike";
import type { BikeModalDefaultValues } from "./bike-modal";


export interface BikeAccessoriesContextType {
  bike?: BikeModalDefaultValues;
  bikes: Bike[];
  equipments?: ComponentBike[];
}

const BikeAccessoriesContext = createContext<BikeAccessoriesContextType>({
  bike: undefined,
  bikes: [],
});

export default BikeAccessoriesContext;
