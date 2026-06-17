import { componentsBikeGetComponentsTypeIndexOptions, componentsBikeGetComponentsTypeShowOptions } from "@/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";

// const TypeComponentBike = new GenericCrud<ComponentsType, ComponentsType, void, void>({
//   resourceName: "bikes/components/types",
//   storagePrefix: "bikes-components-types:",
//   allowRequests: true,
//   resourceTitle(item) {
//     return item.label ? item.label : String(item.id);
//   },
// });

// Export des hooks
export const useComponentBikeType = (id: string) => {
  return useQuery({
    ...componentsBikeGetComponentsTypeShowOptions({ path: { type: id } }),
  })
}

export const useAllComponentBikeTypes = () => {
  return useQuery({
    ...componentsBikeGetComponentsTypeIndexOptions(),
  })
}


