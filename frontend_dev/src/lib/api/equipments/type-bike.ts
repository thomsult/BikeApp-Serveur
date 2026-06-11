import { GenericCrud } from "../common/generic-crud";
import type { BikeType } from "./bike";

const TypeBike = new GenericCrud<BikeType>({
  resourceName: "bikes/types",
  storagePrefix: "bikes-types:",
  allowRequests: true,
  resourceTitle(item) {
    return item.label ? item.label : item.id;
  },
});

// Export des hooks
export const useTypeBike = TypeBike.useItem;
export const useAllTypeBikes = TypeBike.useAll;
