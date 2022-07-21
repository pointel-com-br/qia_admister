import { AdFilter } from "./ad-filter";
import { AdJoined } from "./ad-joined";
import { AdOrder } from "./ad-order";
import { AdRegistry } from "./ad-registry";
import { AdTyped } from "./ad-typed";

export type AdSelect = {
  registry: AdRegistry;
  fields?: AdTyped[];
  joins?: AdJoined[];
  filters?: AdFilter[];
  orders?: AdOrder[];
  offset?: number;
  limit?: number;
};
