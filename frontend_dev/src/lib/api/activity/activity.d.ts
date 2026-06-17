import type { ActivityResource } from "@/client";
import type { Bike, ComponentBike } from "../equipments/bike";
import type { TypeActivity } from "../type-activity/type-activity";
import type { DateTimeString, UUIDString } from "../types";

type TypeActivity =
  | AnyActivityT
  | ActivityRideT
  | ActivityTrainingT
  | ActivityMaintenanceT
  | ActivityEventT
  | ActivityOtherT;

export interface Activity extends ActivityResource { }
type ActivityRideT = Omit<Activity, "typeFamily"> & {
  typeFamily: "ride"
  bike: Bike;
  distance: number;
  duration: number;
  avgSpeed: number;
  maxSpeed: number;
  waypoints: any[];
  startedAt: DateTimeString | null;
  stoppedAt: DateTimeString | null;
};
type ActivityTrainingT = Omit<Activity, "typeFamily"> & {
  typeFamily: "training"
  duration: number;
  trainingType: ActivityResource["trainingType"];
};
type ActivityMaintenanceT = Omit<Activity, "typeFamily"> & {
  typeFamily: "maintenance",
  bike: Bike;
  component: ComponentBike;
  startedAt: DateTimeString | null;
  stoppedAt: DateTimeString | null;

};
type ActivityEventT = Omit<Activity, "typeFamily"> & { typeFamily: "event" };
type ActivityOtherT = Omit<Activity, "typeFamily"> & { typeFamily: "other" };

export interface AnyActivityT
  extends Activity,
  ActivityRideT,
  ActivityTrainingT,
  ActivityMaintenanceT,
  ActivityEventT,
  ActivityOtherT { }

