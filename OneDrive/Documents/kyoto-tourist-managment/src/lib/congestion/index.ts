/**
 * Active adapter: BestTime.app (real crowd data)
 *
 * To revert to mock: change the import below to:
 * export { mockAdapter as congestionAdapter } from "./mockAdapter";
 */
export { bestTimeAdapter as congestionAdapter } from "./bestTimeAdapter";
export type { CongestionAdapter } from "./types";
