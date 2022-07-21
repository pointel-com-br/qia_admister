import { AdFilter } from "./ad-filter";
import { AdJoined } from "./ad-joined";
import { AdOrder } from "./ad-order";
import { AdRegistry } from "./ad-registry";

export class AdRegBase {
  registry: AdRegistry;
  joins?: AdJoined[];
  filters?: AdFilter[];
  orders?: AdOrder[];
}
