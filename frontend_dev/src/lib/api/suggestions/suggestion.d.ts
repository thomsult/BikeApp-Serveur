import { type Href } from "expo-router";
import { type DateTimeString, type UUIDString } from "../types";

type Suggestion = {
  id: UUIDString;
  suggestionType?:
    | "challenge"
    | "maintenance"
    | "weather"
    | "social"
    | "route"
    | "equipment"
    | string;
  title: string;
  subtitle: string;
  link?: Href;
  createdAt: DateTimeString;
  readAt: DateTimeString | null;
};
export type AllSuggestions = Suggestion;
