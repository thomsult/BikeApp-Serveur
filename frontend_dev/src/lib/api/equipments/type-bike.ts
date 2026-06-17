import { useQuery } from "@tanstack/react-query";
import { bikeGetTypeBikeIndexOptions, bikeGetTypeBikeShowOptions } from "@/client/@tanstack/react-query.gen";



// // Export des hooks
export const useTypeBike = (id: string) => {
  return useQuery({
    ...bikeGetTypeBikeShowOptions({ path: { typeBike: id } }),
  })
}
export const useAllTypeBikes = () => {
  return useQuery({
    ...bikeGetTypeBikeIndexOptions(),
    select: (data) => data,
  })
}
