import { createContext } from "react";
import type { Bike, ComponentBike } from "@/lib/api/equipments/bike";

const BikeAccessoriesContext = createContext<{
  bike?: Partial<Bike>;
  bikes: Partial<Bike>[];
  equipments?: ComponentBike[];
}>({
  bike: undefined,
  bikes: [],
});

export default BikeAccessoriesContext;
