import type { UserResource } from "@/client";
import type { DateTimeString, UUIDString } from "../types";

export interface Profil extends UserResource {
  id: UUIDString;
  firstName: string;
  lastName: string;
  name: string; // Added name field to match the API response structure
  username: string;
  email: string;
  phone: string;
  avatarURL: string;
  birthday: DateTimeString;
  firstConnected: DateTimeString;
  bio: string;
  website: string;
  language: string;

  offlineMode: boolean;
  notifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  stats: {
    todayStats: {
      distance: number;
      duration: number;
      goal: number;
    };
    weeklyStats: {
      distance: number;
      duration: number;
      rides: number;
    };
    monthlyStats: {
      distance: number;
      duration: number;
      rides: number;
    };
    totalStats: {
      distance: number;
      duration: number;
      rides: number;
    };
  };
  createdAt?: DateTimeString;
  updatedAt?: DateTimeString;
}
