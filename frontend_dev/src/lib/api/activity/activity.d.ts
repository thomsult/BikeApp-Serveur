import type { Bike, ComponentBike } from "../equipments/bike";
import type { TypeActivity } from "../type-activity/type-activity";
import type { DateTimeString, UUIDString } from "../types";

export type RecurrenceFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "manually"
  | "none";

export interface ActivityRecurrence {
  frequency: RecurrenceFrequency;
  interval?: number; // e.g., every 2 weeks //manually
}

export interface Activity {
  id: UUIDString;
  title: string;
  description: string;
  type: TypeActivity; // Référence à l'ID du type d'activité
  typeFamily: TypeActivity["family"]; // Redondant pour faciliter les requêtes, mais peut être dérivé du type
  dt_start: DateTimeString;
  dt_end?: DateTimeString; // optional end date
  notes?: string;
  // location?: string; //future used
  createdAt?: DateTimeString;
  updatedAt?: DateTimeString;
  completedAt?: DateTimeString; // for marking an activity as completed
  recurrence: ActivityRecurrence | null;
  shareUrl?: string; // URL for sharing the activity, can be generated based on the activity ID or a custom slug
}

export interface ActivityRideT extends Activity {
  distance?: number; // in kilometers
  duration?: number; // in minutes
  avgSpeed?: number; // in km/h
  maxSpeed?: number; // in km/h
  waypoints: LocationObject[];
  startedAt?: DateTimeString; // when the ride started
  stoppedAt?: DateTimeString; // when the ride stopped
  bike?: Bike | null; // associated bike for the ride
  component?: ComponentBike | null;
}

export type TrainingType = "interval" | "endurance" | "tempo" | "recovery";
export interface ActivityTrainingT extends Activity {
  trainingType?: TrainingType; // e.g., "interval", "endurance"
  duration?: number; // in minutes
}

export interface ActivityMaintenanceT extends Activity {
  bike?: Bike | null; // associated bike for the ride
  component?: ComponentBike | null;
}
export type ActivityEventT = Activity;
export type ActivityOtherT = Activity;

export interface AnyActivityT
  extends Activity,
  ActivityRideT,
  ActivityTrainingT,
  ActivityMaintenanceT,
  ActivityEventT,
  ActivityOtherT { }

export type ActivityTypeFamily = "ride" | "training" | "maintenance" | "event";
