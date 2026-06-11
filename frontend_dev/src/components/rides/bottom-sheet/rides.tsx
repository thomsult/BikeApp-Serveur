import { ModalLayout } from "@/components/layout/modal-layout";
import type { ActivityRideT } from "@/lib/api/activity/activity";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RIDE_STATUS, useRideDispatch, useRideStore, type RideStatus } from "../rides-context";
import { useDrawingRoute } from "@/lib/map/use-drawing-route";
import { ActivityIcon, GaugeIcon, MapIcon, PauseIcon, PlayIcon, Share } from "lucide-react";
import { StopIcon } from "@radix-ui/react-icons";
import { formatDistance, formatDistanceByHour } from "@/lib/map/utils";
import type { LucideIcon } from "lucide-react";
import { cn, toHHMMSS } from "@/lib/utils";
import { StatsCard } from "@/components/ui/stats-card";
import { formatDuration } from "date-fns";
import { Card } from "@/components/ui/card";
import { useCenterUserLocation, useLocationStore } from "@/lib/map/use-location-store";
import { Portal } from "radix-ui";

const RideButton = ({
  Icon,
  onClick,
  size = "md",
  className,
}: {
  Icon: LucideIcon | React.ElementType;
  onClick: () => void;
  size?: "sm" | "md";
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex items-center hover:bg-card/40 cursor-pointer justify-center rounded-full border border-border/30 bg-background transition-opacity active:scale-95",
      size === "md" && "size-22",
      size === "sm" && "size-18",
      className,
    )}
  >
    <Icon className={cn(size === "md" ? "size-6" : "size-4")} />
  </button>
);


// ─── Controls ─────────────────────────────────────────────────────────────────

const RideControls = ({
  isPlaying,
  isPaused,
  onPlayPause,
  onStart,
  onStop,
}: {
  isPlaying: boolean;
  isPaused: boolean;
  onPlayPause: () => void;
  onStart: () => void;
  onStop: () => void;
  initialData?: Partial<ActivityRideT>;
}) => (
  <div className="flex items-center justify-center gap-4">
    {/* Stop — visible uniquement en pause */}
    <RideButton
      Icon={StopIcon}
      size="sm"
      onClick={onStop}
      className={cn(
        "transition-all duration-200",
        isPaused ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    />

    {/* Play / Pause principal */}
    <RideButton
      Icon={isPlaying ? PauseIcon : PlayIcon}
      size="md"
      onClick={isPlaying || isPaused ? onPlayPause : onStart}
      className={cn(
        "text-background",
        (isPlaying) ? "bg-foreground hover:bg-foreground/90" : "bg-primary hover:bg-primary/90",
      )}
    />

    {/* Placeholder symétrique */}
    <RideButton
      Icon={Share}
      size="sm"
      onClick={() => { }}
    />
  </div>
);

const InfoModal = ({
  isPlaying,
  isPaused,
  onPlayPause,
  onStart,
  setSnap,
  snapPoints,
  snap,
}: {
  isPlaying: boolean;
  isPaused: boolean;
  onPlayPause: () => void;
  onStart: () => void;
  onStop: () => void;
  initialData?: Partial<ActivityRideT>;
  formattedDuration?: string;
  snap: string;
  setSnap: React.Dispatch<React.SetStateAction<string | number>>;
  snapPoints: (number | string)[];
}) => {

  const onPlayPauseLocal = () => {
    onPlayPause();
    setSnap(snapPoints[1]);
  };

  const Render = () => {
    switch (true) {
      case isPlaying:
        return <RideButton Icon={PauseIcon} onClick={onPlayPauseLocal} className="size-12 bg-foreground text-background hover:bg-foreground/90 border-transparent"
        />;
      case isPaused:
        return <RideButton Icon={PlayIcon} onClick={onPlayPauseLocal} className={cn(
          "text-background size-12",
          (isPlaying) ? "bg-foreground hover:bg-foreground/90" : "bg-primary hover:bg-primary/90",
        )}
        />;
      default:
        return <RideButton Icon={PlayIcon} onClick={onStart} className={cn(
          "size-12 text-background",
          (isPlaying) ? "bg-foreground hover:bg-foreground/90" : "bg-primary hover:bg-primary/90",
        )}
        />;
    };
  };
  useEffect(() => {
    if (isPlaying) {
      setSnap(snapPoints[0]);
    }
  }, [isPlaying]);

  const isDesktop = window.innerWidth >= 768;
  return (<Card
    style={{
      position: "absolute",
      transition: "transform 0.3s ease",
      opacity: !isPlaying && !isPaused ? 0 : 1,
      transform: isDesktop ? "translate(-100px, 250px) scale(0.95)" : `translate(87vw,${isPlaying ? -200 : -100}px) scale(1)`,
      zIndex: 1000,
    }}
    className={cn(
      "p-2.5 absolute flex items-center justify-center rounded-lg flex-col",
      "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
      "cursor-pointer",

    )}
  >
    <Render />
  </Card>);
};

// ─── RideNow ──────────────────────────────────────────────────────────────────

interface RideNowProps {
  actions?: RideStatus;
  handleEndRide: (data: Partial<ActivityRideT>) => void;
  initialData?: Partial<ActivityRideT>;
}

const RideNow = ({ actions, handleEndRide, initialData }: RideNowProps) => {
  const { t } = useTranslation();
  const rideState = useRideStore();
  const { distance, currentSpeed, avgSpeed, rideState: status } = rideState;
  const { resetCoordinate, replaceCoordinates, setIsReadOnly, liveCoordinates } = useDrawingRoute();
  const centerOnUserLocation = useCenterUserLocation();

  const onStartCb = useCallback(() => {
    centerOnUserLocation();
    // replaceCoordinates(initialData?.waypoints ?? []);
    setIsReadOnly(true);
  }, [centerOnUserLocation, replaceCoordinates, initialData, setIsReadOnly]);

  const onResetCb = useCallback(async () => {
    setIsReadOnly(false);
    handleEndRide({ ...rideState, waypoints: liveCoordinates } as ActivityRideT);
    resetCoordinate();
  }, [t, resetCoordinate, setIsReadOnly, handleEndRide, rideState, liveCoordinates]);


  const { handleReset, handlePause, handleStart, handleRestart } = useRideDispatch({
    onStart: onStartCb,
    onPause: () => { },
    onReset: onResetCb,
  });
  useEffect(() => {
    if (actions === 'play' && initialData && !isPaused) {
      handleStart(initialData as Partial<ActivityRideT>);

    }
    if (actions === 'play' && initialData && isPaused) {
      handleRestart();

    }
    else if (actions === 'pause') {
      handlePause();


    } else if (actions === 'stop') {
      handleReset();

    }
    return () => {

      console.log("Unmount RideNow, end ride if needed");
      // Nettoyage à la fermeture du composant
      resetCoordinate();
      setIsReadOnly(false);
    };
  }, [actions, initialData]);

  const stats = [
    {
      label: t("common.stats.distance"),
      value: formatDistance(distance ?? 0),
      Icon: MapIcon,
      size: "small",
    },
    {
      label: t("common.stats.avgSpeed"),
      value: formatDistanceByHour(avgSpeed ?? 0),
      Icon: ActivityIcon,
      size: "small",

    },
    {
      label: t("common.stats.speed"),
      value: formatDistanceByHour(currentSpeed ?? 0),
      Icon: GaugeIcon,
      size: "small",
    },
  ];
  const isPlaying = status === RIDE_STATUS.PLAY;
  const isPaused = status === RIDE_STATUS.PAUSE;


  const duration = formatDuration({
    seconds: rideState.duration ?? 0,
  }, { format: ["hours", "minutes", "seconds"] });

  const isDesktop = window.innerWidth >= 768;
  return (<>
    <ModalLayout
      presentationMode="drawer"
      backdropVisibility="hidden"

      snapPoints={isDesktop ? ["0px", "250px", '500px'] : ["0px", "50%", "80%"]}
      defaultSnap={0.5}
      hideModal={async () => true}
      showModal={true}
      onModalUnmount={() => {
        console.log("Unmount RideNowModal");
      }}
      infoModal={(props) => <InfoModal {...props} formattedDuration={toHHMMSS(rideState.duration ?? 0)} isPlaying={isPlaying} isPaused={isPaused} onPlayPause={handlePause} onStart={() => handleStart(initialData as Partial<ActivityRideT>)} onStop={handleReset} initialData={initialData} />}
    >{(snap, setSnap, snapPoints) => (

      <div className="flex h-full flex-col gap-5 md:flex-row md:gap-0">

        {/* ── Panneau desktop uniquement (drawer latéral) ── */}
        <div className="hidden md:flex md:w-[480px] md:flex-col md:gap-5 md:border-l md:border-border/20 md:pl-5">
          {/* Timer */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {initialData?.title || t("app.rides.title")}
            </p>
            <p className="mt-1 text-4xl font-medium tabular-nums">{duration || "00:00:00"}</p>
          </div>


          <RideControls
            isPlaying={isPlaying}
            isPaused={isPaused}
            onPlayPause={handlePause}
            onStart={() => handleStart(initialData as Partial<ActivityRideT>)}
            onStop={() => {
              handleReset();
              setSnap(snapPoints[2]);
            }}
            initialData={initialData}
          />

          <p className="text-center text-xs text-muted-foreground">
            {t("common.ride." + status)}
          </p>
          <div className="h-px bg-border/20" />

          {/* Stats liste */}
          <div className="flex flex-col gap-2 w-full">
            {stats.map((s) => (
              <StatsCard key={s.label} layout="list" {...s} />
            ))}
          </div>

          {/* Pousse les contrôles en bas */}
          <div className="flex-1" />

        </div>

        {/* ── Bottom sheet (mobile) ── */}
        <div className="flex flex-col gap-2 md:hidden h-screen">
          {/* Timer */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {initialData?.title || t("app.rides.title")}
            </p>
            <p className="mt-1 text-3xl font-medium tabular-nums">{duration || "00:00:00"}</p>
          </div>
          <div
          >
            <RideControls
              isPlaying={isPlaying}
              isPaused={isPaused}
              onPlayPause={handlePause}
              onStart={() => handleStart(initialData as Partial<ActivityRideT>)}
              onStop={() => {
                handleReset();
                setSnap(snapPoints[2]);
              }}
              initialData={initialData}
            />
          </div>

          <p className="text-center text-xs text-muted-foreground">
            {t("common.ride." + status)}
          </p>
          {/* Stats grille */}
          <div className="flex  gap-2 mb-6 mt-2">
            {stats.map((s) => (
              <StatsCard key={s.label} layout="grid" {...s} />
            ))}
          </div>

          {/* Contrôles */}

        </div>
      </div>

    )}
    </ModalLayout >
  </>
  );
};



export default RideNow;