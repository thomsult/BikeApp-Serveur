import { type UUIDString } from "../types";

export interface Challenge {
  id: UUIDString;
  title: string;
  description: string;
  progress?: number;
  challengeType: "distance" | "time" | "speed";
  challengeValue: number;
  durationChallenge: number;
  isDailyGoal?: boolean;
  isSuggestion?: boolean;
  createdAt: string;
  updatedAt: string;
}
