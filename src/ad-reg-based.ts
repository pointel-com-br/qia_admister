import { AdFilter } from "./ad-filter";
import { AdJoined } from "./ad-joined";
import { AdOrder } from "./ad-order";
import { AdRegistier } from "./ad-registier";

export class AdRegBased {
  registier: AdRegistier;
  joins?: AdJoined[];
  filters?: AdFilter[];
  orders?: AdOrder[];
}
