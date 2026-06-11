export {};

// const rideCrud = new GenericCrud<Ride>({
//   resourceName: "rides",
//   allowRequests: false,
//   storagePrefix: "rides:",
//   resourceTitle(item) {
//     return item.name ? item.name : item.id;
//   },
// });

// Export des hooks
// export const useRide = rideCrud.useItem;
// export const useAllRides = rideCrud.useAll;
// export const useUpdateRide = rideCrud.useUpdate;
// export const useCreateRide = rideCrud.useCreate;
// export const useDeleteRide = rideCrud.useDelete;
// export function useExternalRide<T>() {
//   return createQuery<T, { id: string }, Promise<T> | Error>({
//     queryKey: ["externalRide", "item"],
//     staleTime: 0,
//     fetcher: async ({ id }) => {
//       if (!id) throw new Error("ID is required");
//       const response = await client.get(`rides/${id}`);
//       const apiItem = response.data as T;
//       return apiItem;
//     },
//   });
// }
