import type { RideState } from "@/components/rides/rides-context";
import { create } from "zustand";
import { persist } from 'zustand/middleware'
import type { LocationObject } from "./map";


interface DrawContextType {
  routeCoordinates: LocationObject[];
  liveCoordinates: LocationObject[];
  setLiveCoordinates: (coords: LocationObject[]) => void;
  isEditMode: boolean;
  isReadOnly: boolean;
  replaceCoordinates: (newCoords: LocationObject[], isDirty?: boolean) => void;
  addCoordinate: (coordinate: LocationObject) => void;
  removeCoordinate: (index: number) => void;
  insertCoordinate: (index: number, coordinate: LocationObject) => void;
  moveCoordinate: (index: number, newCoordinate: LocationObject) => void;
  prependCoordinate: (coordinate: LocationObject) => void;
  resetCoordinate: () => void;
  toggleEditMode: () => void;
  toggleReadOnly: () => void;
  setIsReadOnly: (isReadOnly: boolean) => void;
  setDraggedIndex: (index: number | null) => void;
  draggedIndex: number | null;
  pendingDragIndex: number | null;
  setPendingDragIndex: (index: number | null) => void;
  setIsEditMode: (isEditMode: boolean) => void;
  initialize: (data: Partial<RideState>) => void;
  flush: () => void;
  isClosed: boolean;
  isDirty: boolean;
  setIsClosed: (val: boolean) => void;
  mapIsReady: boolean;
  setIsMapReady: (ready: boolean) => void;
}


export const useDrawingRoute = create<DrawContextType>()(
  persist(
    (set, get) => ({
      callbackOnMapReady: (e) => e(),
      mapIsReady: false,
      setIsMapReady: (ready: boolean) => set({ mapIsReady: ready }),
      routeCoordinates: [],
      liveCoordinates: [],
      setLiveCoordinates: (coords) => set({ liveCoordinates: coords }),
      isEditMode: false,
      isReadOnly: false,
      isClosed: false,
      isDirty: false,
      setIsClosed: (val: boolean) => set({ isClosed: val, isDirty: true }),
      replaceCoordinates: (newCoords, isDirty = true) => set({ routeCoordinates: newCoords, isDirty }),
      addCoordinate: (coordinate) =>
        set((state) => ({ routeCoordinates: [...state.routeCoordinates, coordinate], isEditMode: true, isDirty: true })),
      removeCoordinate: (index) =>
        set((state) => ({
          routeCoordinates: state.routeCoordinates.filter((_, i) => i !== index),
          isEditMode: true,
          isDirty: true,
        })),
      insertCoordinate: (index, coordinate) =>
        set((state) => {
          const newCoords = [...state.routeCoordinates];
          newCoords.splice(index, 0, coordinate);
          return { routeCoordinates: newCoords, isEditMode: true, isDirty: true };
        }),
      moveCoordinate: (index, newCoordinate) =>
        set((state) => {
          const newCoords = [...state.routeCoordinates];
          if (!newCoords[index]) return {};
          newCoords[index] = {
            ...newCoords[index],
            coords: newCoordinate.coords,
          };
          return { routeCoordinates: newCoords, isEditMode: true, isDirty: true };
        }),
      prependCoordinate: (coordinate) =>
        set((state) => ({
          routeCoordinates: [coordinate, ...state.routeCoordinates],
          isEditMode: true,
          isDirty: true,
        })),
      resetCoordinate: () => set({ routeCoordinates: [], isDirty: true }),
      toggleEditMode: () =>
        set((state) => ({ isEditMode: !state.isEditMode, pendingDragIndex: null })),
      toggleReadOnly: () =>
        set((state) => ({ isReadOnly: !state.isReadOnly })),
      setIsReadOnly: (isReadOnly) => set({ isReadOnly }),
      setDraggedIndex: (index) => set({ draggedIndex: index }),
      draggedIndex: null,
      pendingDragIndex: null,
      setPendingDragIndex: (index) => set({ pendingDragIndex: index }),
      setIsEditMode: (isEditMode) => set({ isEditMode }),

      initialize: (data) =>
        set({
          routeCoordinates: data.waypoints || [],
          liveCoordinates: data.waypoints || [],
          isReadOnly: !!data.id,
          isDirty: false,
        }),
      flush: () =>
        set({
          routeCoordinates: [],
          liveCoordinates: [],
          isEditMode: false,
          isReadOnly: false,
          draggedIndex: null,
          pendingDragIndex: null,
          isDirty: false,
        }),
    }),
    {
      name: 'drawing-route-storage',
      onRehydrateStorage: () => (state) => {
        console.log("HYDRATED", state);
      }
    },
  ),
)

