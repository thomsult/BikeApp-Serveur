import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { useRideNavigation } from "@/lib/hooks/use-ride-navigation";
import RideNow from "./rides";
import SaveRide from "./save";
import { useDrawingRoute } from "@/lib/map/use-drawing-route";
import { useEffect } from "react";
import { useMap } from "react-map-gl/mapbox";


interface RideRendererProps {
  viewState: ReturnType<typeof useRideNavigation>["viewState"];
  actions: ReturnType<typeof useRideNavigation>["actions"];
  isLoading: ReturnType<typeof useRideNavigation>["isLoading"];
}

const allowEditMode = (viewState: RideRendererProps["viewState"]) => {
  if (viewState.type === "save_ride" && viewState.data?.dt_start) {
    return new Date(viewState.data.dt_start) > new Date();
  }
  return false;
};


const RideRenderer = ({ viewState, actions, isLoading }: RideRendererProps) => {
  if (isLoading) {
    return (
      <div className="bg-white-200/20 w-full h-full flex items-center justify-center">
        <ActivityIndicator size="lg" />
      </div>
    );
  }

  switch (viewState.type) {
    case "ride_now":
      return (
        <RideNow
          handleEndRide={actions.handleEndRide}
          actions={viewState.actions}
          initialData={viewState.data}
        />
      );

    case "save_ride":
      return (
        <SaveRide
          data={viewState.data}
          handleSaveRide={actions.saveRide}
          handleWithOutSaving={actions.confirmWithOutSaving}
          // handleClose={actions.handleClose}
          handleRemove={actions.confirmDeleteRide}
          handleStartRide={actions.handleStartRide}
          StartRideLoading={isLoading}
          allowEditMode={allowEditMode(viewState)}
        />
      );

    default:
      return null;
  }
};


const RideBottomSheet = () => {
  const { current: map } = useMap();
  const { replaceCoordinates, setIsReadOnly } = useDrawingRoute();
  const mapIsReady = useDrawingRoute((s) => s.mapIsReady);
  const { viewState, actions, isLoading } = useRideNavigation();

  useEffect(() => {
    setIsReadOnly(!allowEditMode(viewState)); // Read-only if not allowed to edit
    if (viewState.type === "idle") {
      replaceCoordinates([], false);
      return;
    }

    if (!mapIsReady) {
      console.warn("Map not ready yet");
      return;
    }
    replaceCoordinates(viewState.data?.waypoints || [], false);

  }, [viewState.type, viewState, mapIsReady]);

  return mapIsReady && <RideRenderer viewState={viewState} actions={actions} isLoading={isLoading} />;
};
export default RideBottomSheet;
