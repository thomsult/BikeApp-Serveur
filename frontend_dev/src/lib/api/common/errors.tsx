import type { AxiosError } from "axios";

export type Error = AxiosError<{
  message: string;
  errors?: Record<string, string[]>;
}>;
