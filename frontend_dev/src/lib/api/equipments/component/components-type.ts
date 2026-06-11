import { GenericCrud } from "../../common/generic-crud";
import type { ComponentBikeType } from "../bike";

const TypeComponentBike = new GenericCrud<ComponentBikeType>({
  resourceName: "bikes/components/types",
  storagePrefix: "bikes-components-types:",
  allowRequests: true,
  resourceTitle(item) {
    return item.label ? item.label : item.id;
  },
});

// Export des hooks
export const useComponentBikeType = TypeComponentBike.useItem;
export const useAllComponentBikeTypes = TypeComponentBike.useAll;
