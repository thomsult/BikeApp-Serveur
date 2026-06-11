import { EditModeButton } from "@/components/map/edit-mode-button";
import { RideNowButton } from "@/components/map/ride-now-button";
import { UserLocationButton } from "@/components/map/user-location-button";
import RideBottomSheet from "@/components/rides/bottom-sheet";
import { PolylineDrawer } from "@/lib/map/map-draw-polyline";
import { useDrawingRoute } from "@/lib/map/use-drawing-route";
import { MarkerUserLocation } from "@/lib/map/use-user-location";
import { createFileRoute, useRouter } from "@tanstack/react-router"
import {
  memo,
} from "react";
import { Map, MapProvider, NavigationControl } from "react-map-gl/mapbox";


// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_CENTER: [number, number] = [1.444209, 43.604652]; // Toulouse fallback
const INITIAL_ZOOM = 10;

const prefersDark =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const mapStyle = prefersDark
  ? "mapbox://styles/mapbox/dark-v11"
  : "mapbox://styles/mapbox/streets-v12";



const MapControls = memo(() => (
  <NavigationControl position="top-left" />
));

const MapContent = memo(() => {
  return (
    <>
      <MarkerUserLocation />
      <PolylineDrawer />


    </>
  );
});

// ── Toolbar mémoïsé ─────────────────────────────────────────────────────────
const MapToolbar = memo(() => {
  return (
    <div className="flex flex-col absolute gap-4 top-0 right-0 md:right-4  m-4">
      <UserLocationButton />
      <RideNowButton />
      <EditModeButton />
    </div>
  )
});

const RidesScreen = ({ children }: { children?: React.ReactNode }) => {

  return (
    <>
      <Map
        id="map"
        mapboxAccessToken={import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: INITIAL_CENTER[0],
          latitude: INITIAL_CENTER[1],
          zoom: INITIAL_ZOOM,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyle}
        doubleClickZoom={false}
        reuseMaps={true}
      >
        <MapControls />
        <MapContent />
        <MapToolbar />
        {children}
      </Map>

    </>
  );
};
export const Route = createFileRoute('/(app)/ride')({
  component: () => {

    return <div className="md:pl-16 lg:pl-0 lg:w-full  h-screen relative">
      <MapProvider>
        <RidesScreen>
          <RideBottomSheet />
        </RidesScreen>
      </MapProvider>
    </div>


  },
})