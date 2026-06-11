import { RecurrenceActivity } from "@/components/activities/activites-modal/recurrence-activity";
import { alertsConfirmation } from "@/components/alerts";
import { formatDateTimeDisplay } from "@/components/calendar/calendar-utils";
import { BikeFormField } from "@/components/form/bike-form-field";
import { ModalLayout } from "@/components/layout/modal-layout";
import { ShareLinks } from "@/components/share/share-links";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { ControlledInput, Input } from "@/components/ui/input";
import { ControlledSelectInput } from "@/components/ui/select-input";
import { StatsCard } from "@/components/ui/stats-card";
import { ControlledTextarea } from "@/components/ui/textarea";
import type { ActivityRideT, AnyActivityT } from "@/lib/api/activity/activity";
import { useAllBikes } from "@/lib/api/equipments";
import { useAllTypeActivities } from "@/lib/api/type-activity";
import { useDrawingRoute } from "@/lib/map/use-drawing-route";
import { estimateCyclingDuration, formatDistance, formatDistanceByHour, getDistanceFromRoute, getDistanceFromWaypoints } from "@/lib/map/utils";
import { cn } from "@/lib/utils";
import { useForm, useStore } from "@tanstack/react-form";
import { useBlocker, useRouter } from "@tanstack/react-router";
import { formatDuration } from "date-fns";
import { ClockIcon, InfoIcon, PlusIcon, Ruler, RulerIcon, TimerIcon, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMap } from "react-map-gl/mapbox";

const InfoModal = ({
  setSnap,
  snapPoints,
  snap,
  isReadOnly
}: {
  setSnap: (index: number | string) => void;
  snapPoints: (number | string)[];
  snap: number | string;
  isReadOnly: boolean;

}) => {
  const isDesktop = window.innerWidth > 768;
  return (
    <div className="relative "
      style={{
        transform: isDesktop ? `translate(-100px,${isReadOnly ? 168 : 210}px) ` : `translate(calc(100% - 90px),-290px) `,
        opacity: snap === snapPoints[0] ? 1 : 0,
        pointerEvents: snap === snapPoints[0] ? "auto" : "none",
        transition: "opacity 0.3s ease-in-out",

      }}
    >
      <Card
        className={cn(
          "p-2.5 absolute flex items-center justify-center rounded-lg flex-col",
          "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
          "cursor-pointer",

        )}
        onClick={() => {
          setSnap(snapPoints[1]);
        }}
      >
        <InfoIcon className="size-12 text-primary" />
      </Card></div>);
}


const defaultValuesRide: Partial<ActivityRideT> = {
  title: "",
  dt_start: new Date().toISOString(),
  dt_end: undefined,
  description: "",
  distance: 0,
  duration: 0,
  avgSpeed: 10,
  maxSpeed: 10,
  type: undefined,
  typeFamily: "ride",
  recurrence: {
    frequency: "none",
    interval: 0,
  },

  waypoints: [],
};

const SaveRide = ({
  data: activityData,
  handleSaveRide,
  handleRemove,
  handleWithOutSaving,
  handleStartRide,
  StartRideLoading,
  allowEditMode = true,
}: {
  data: Partial<ActivityRideT> | undefined;
  handleSaveRide: (data: Partial<ActivityRideT>) => Promise<void>;
  handleRemove: (data: Partial<ActivityRideT>) => Promise<AnyActivityT | undefined>;
  handleWithOutSaving: () => Promise<boolean>;
  handleStartRide: (data: Partial<ActivityRideT>) => void;
  StartRideLoading: boolean;
  allowEditMode?: boolean;
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { routeCoordinates, isDirty: routeIsDirty, setIsEditMode } = useDrawingRoute();
  const { data: activityType } = useAllTypeActivities();
  console.log("🚀 ~ file: save.tsx:144 ~ SaveRide ~ data:", activityData)
  const map = useMap();
  const getDefaultValues = (data: Partial<ActivityRideT> | undefined) => {
    return {
      ...defaultValuesRide,
      ...data,
      type:
        data?.type ||
        activityType?.find((type) => type.family === "ride")?.id ||
        "ride",
      typeFamily: data?.typeFamily || "ride",
      title: data?.title || new Date().toISOString(),
      bike: data?.bike,
      dt_start: data?.dt_start || new Date().toISOString(),
      dt_end: data?.dt_end || undefined,
      description: data?.description || "",
      waypoints: data?.waypoints || [],
      distance: data?.distance || getDistanceFromWaypoints(data?.waypoints || []) || 0,
      duration: data?.duration || estimateCyclingDuration(getDistanceFromWaypoints(data?.waypoints || []), 15) || 0,
      avgSpeed: data?.avgSpeed || 15,
      maxSpeed: data?.maxSpeed || 15,
    } as Partial<ActivityRideT>;
  };

  const handleSave = async () => {
    if (formState.id === "new") {
      delete formState.id; // Supprimer l'id "new" avant de sauvegarder
    }
    setIsEditMode(false);
    await handleSaveRide({
      waypoints: routeCoordinates,
      ...formState!,
    });
  };

  const isReadOnly = !allowEditMode; //readOnly || formState.createdAt !== undefined;


  const form = useForm({
    onSubmit: handleSave,
    defaultValues: getDefaultValues(activityData),
  });
  const { Field, store, handleSubmit, setFieldMeta, setFieldValue, reset } = form;
  const { values: formState, isDirty, dadata2ta } = useStore(store, (state: any) => {
    return { values: state.values, isDirty: state.isDirty, dadata2ta: state } as {
      values: Partial<ActivityRideT>, isDirty: boolean, dadata2ta: any
    };
  });

  useEffect(() => {
    if (routeIsDirty) {
      setFieldValue("waypoints", routeCoordinates);
      const distance = getDistanceFromWaypoints(routeCoordinates);
      const duration = estimateCyclingDuration(distance, 15); // Supposons une vitesse moyenne de 15 km/h
      setFieldValue("distance", distance);
      setFieldValue("duration", duration);
    }
  }, [routeIsDirty, routeCoordinates, setFieldValue]);

  useBlocker({
    shouldBlockFn: async ({ next }) => {
      if (!isDirty) return false; // Si pas de changement, ne pas bloquer
      const confirm = await handleWithOutSaving();
      if (confirm) {
        handleSubmit(); // Soumettre le formulaire avant de naviguer
        console.log("User confirmed navigation, saving ride and allowing navigation", next);
        return false;
      } else {
        console.log("User cancelled navigation, staying on the page");
        return true;
      }
    },
  })

  const handleRemoveRide = useCallback(async () => {
    await handleRemove(formState!);
    router.navigate({ to: "/welcome" });

  }, [formState, handleRemove]);


  const pxToNumber = (px: string | number) => {
    if (typeof px === "number") return px;
    return parseInt(px.replace("px", ""));
  };
  const formatedDuration = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds}s`;
  };
  const { data: bikes } = useAllBikes();
  if (!bikes) return null;

  return (<ModalLayout
    presentationMode="drawer"
    title={formState.title || t("app.rides.new_ride")}
    description={t("common.generalInfosDescription")}
    backdropVisibility="hidden"
    snapPoints={["0px", 0.3, 0.5, 0.75, 0.9]}
    defaultSnap={1}
    hideModal={async () => true}
    showModal={true}
    onModalUnmount={() => {
      console.log("Unmount RideNowModal");
    }}
    footer={{
      handleSubmit: handleSubmit,
      isDirty,
      isValid: true,
    }}
    infoModal={(props) => <InfoModal isReadOnly={isReadOnly} {...props} />}
    handleChangeSnap={(index => {
      if (map.current) {
        if (window.innerWidth > 768) {
          map.current?.easeTo({
            padding: {
              bottom: 0,
              left: 0,
              right: pxToNumber(index), // Adjust the padding value based on the snap point index,
              top: 0,
            }
          }, { duration: 100 });
          return;
        }; // skip on mobile, the padding is not good and we want to keep it simple for now
        map.current?.easeTo({
          padding: {
            bottom: pxToNumber(index) * window.innerHeight, // Adjust the padding value based on the snap point index
            left: 0,
            right: 0,
            top: 0,
          }
        }, { duration: 100 });
      }
    })}

  >
    <div className="min-h-screen overflow-scroll md:w-[500px] px-4 mt-2 ">



      <div className="mb-10 gap-4 flex flex-col">
        <FormField
          label={t("app.rides.fields", {
            field: t("common.fields.name"),
          })}
        >
          <ControlledInput
            Field={Field}
            id="title"
            placeholder={t("common.placeholders.name")}
            defaultValue={formState.title || ""}
            disabled={isReadOnly}
          />
        </FormField>
        <FormField
          label={t("app.rides.fields", {
            field: t("common.fields.description"),
          })}
        >
          <ControlledTextarea
            id="description"
            placeholder={t("common.placeholders.description")}
            Field={Field}
            numberOfLines={4}
            defaultValue={formState.description || ""}
            disabled={isReadOnly}

          />
        </FormField>
        <FormField
          label={t("components.activities.field", {
            field: t("common.fields.dt_start"),
          })}
        >
          <ControlledInput
            Field={Field}
            id="dt_start"
            type="datetime-local"
            defaultValue={formState.dt_start ? new Date(formState.dt_start).toISOString().slice(0, 16) : undefined}
            disabled={isReadOnly}
          />
        </FormField>
        <FormField
          label={t("components.activities.field", {
            field: t("common.fields.dt_end"),
          })}
        >
          <ControlledInput
            Field={Field}
            id="dt_end"
            type="datetime-local"
            disabled={isReadOnly}
            defaultValue={formState.dt_end ? new Date(formState.dt_end).toISOString().slice(0, 16) : undefined}
          />
        </FormField>
        <FormField
          label={t("components.activities.field", {
            field: t("common.fields.recurrence"),
          })}
        >
          <RecurrenceActivity form={form} editable={!isReadOnly} />
        </FormField>

        <FormField
          label={t("components.activities.field", {
            field: t("common.fields.notes"),
          })}
        >
          <ControlledTextarea
            id="notes"
            placeholder={t("common.placeholders.notes")}
            Field={Field}
            numberOfLines={4}
            disabled={isReadOnly}
            defaultValue={formState.notes || ""} />
        </FormField>
        <BikeFormField
          Field={Field as any}
          form={form}
          editable={!isReadOnly}
          defaultValue={formState}
          bikes={bikes}
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-base font-bold">
          Status: {formState.dt_end ? "ended" : "not started"}
        </p>
        {formState.id && (
          <Button
            variant="outline"
            size="default"
            onClick={() => handleStartRide(formState)}
            disabled={StartRideLoading}
          >
            <PlusIcon className="size-4" />
            demarrer
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-base font-bold">
          Distance: {formatDistance(formState.distance || 0)}
        </p>

      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />
      <div className="flex flex-col gap-3">
        <p className="text-base font-bold">
          {t("common.fields.stats")}
        </p>
        <div className="flex  flex-wrap gap-3">
          <StatsCard
            size="small"
            label={t("common.stats.distance")}
            value={formatDistance(formState.distance || 0)}
            Icon={RulerIcon}

          />
          <StatsCard
            size="small"
            label={t("common.stats.duration")}
            value={formatedDuration(formState.duration || 0)}

            Icon={ClockIcon}
          />
        </div>
        <div className="flex  flex-wrap gap-3">
          <StatsCard
            size="small"
            label={t("common.stats.avgSpeed")}
            value={formatDistanceByHour(formState?.avgSpeed || 0)}

            Icon={TimerIcon}
          />
          <StatsCard
            size="small"
            label={t("common.stats.maxSpeed")}
            value={formatDistanceByHour(formState?.maxSpeed || 0)}

            Icon={TimerIcon}
          />
        </div>
      </div>
      <div className="mt-4">
        <ShareLinks
          ressource={{
            type: "activities",
            id: formState.id!,
          }}
          title={`${t("app.rides.title")} ${formState?.title}`}
        />
      </div>

      <div className="mt-6 flex items-center space-x-4">
        {formState && formState.id && (
          <Button
            variant="outline-destructive"
            onClick={handleRemoveRide}
          >
            <Trash2Icon className="size-4" />

            <span className="text-destructive">
              {t("app.rides.delete_ride")}
            </span>
          </Button>
        )}
      </div>
    </div>

  </ModalLayout >);
};


export default SaveRide;
