import { type DateTimeString, type UUIDString } from "../types";

export type TypeActivityFamily =
  | "ride"
  | "maintenance"
  | "event"
  | "challenge"
  | "training"
  | "other";

export interface TypeActivity {
  id: UUIDString;
  label: string;
  family: TypeActivityFamily;
  color: string;
  // userId?: UUIDString; // Si présent, indique que ce type d'activité est personnalisé par l'utilisateur
  createdAt?: DateTimeString;
  updatedAt?: DateTimeString;
  isDefault?: boolean; // Indique si c'est un type d'activité par défaut (non modifiable)
  _isInvoked: boolean; // JS Only
}
