export type PaginateQuery<T> = {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
};
export type EmptyRequest = undefined;
export type DateTimeString = string; // ISO 8601 format
export type UUIDString = string; // UUID format

export type ID = number | string;
