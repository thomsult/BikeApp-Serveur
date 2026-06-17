import type { TypeActivityFamily, TypeActivityResource } from "@/client";
import { type DateTimeString, type UUIDString } from "../types";

export { type TypeActivityFamily } from "@/client";
export interface TypeActivity extends TypeActivityResource {
  _isInvoked?: boolean; // JS Only
}
