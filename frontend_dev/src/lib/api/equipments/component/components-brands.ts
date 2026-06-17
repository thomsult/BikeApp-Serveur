import { componentsBikeGetComponentsBrandIndexOptions, componentsBikeGetComponentsBrandShowOptions } from "@/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

// const BrandComponentBike = new GenericCrud<ComponentBikeBrand>({
//   resourceName: "bikes/components/brands",
//   storagePrefix: "bikes-components-brands:",
//   allowRequests: true,
//   resourceTitle(item) {
//     return item.label ? item.label : item.id;
//   },
// });

// Export des hooks
export const useComponentBikeBrand = (id: string) => {
  return useQuery({
    ...componentsBikeGetComponentsBrandShowOptions({ path: { brand: id } }),
  })
}

export const useAllComponentBikeBrands = () => {
  return useQuery({
    ...componentsBikeGetComponentsBrandIndexOptions(),
  })
}
