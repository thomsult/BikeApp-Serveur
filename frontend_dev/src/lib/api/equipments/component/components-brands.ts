import { GenericCrud } from "../../common/generic-crud";
import type { ComponentBikeBrand } from "../bike";

const BrandComponentBike = new GenericCrud<ComponentBikeBrand>({
  resourceName: "bikes/components/brands",
  storagePrefix: "bikes-components-brands:",
  allowRequests: true,
  resourceTitle(item) {
    return item.label ? item.label : item.id;
  },
});

// Export des hooks
export const useComponentBikeBrands = BrandComponentBike.useItem;
export const useAllComponentBikeBrands = BrandComponentBike.useAll;
