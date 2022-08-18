import { AdFilter } from "./ad-filter";
import { AdRegistier } from "./ad-registier";
import { AdValued } from "./ad-valued";

export type AdUpdate = {
  registier: AdRegistier;
  valueds: AdValued[];
  filters: AdFilter[];
  limit: number;
};
