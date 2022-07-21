import { AdFilter } from "./ad-filter";
import { AdRegistry } from "./ad-registry";

export type AdDelete = {
  registry: AdRegistry;
  filters: AdFilter[];
  limit: number;
};
