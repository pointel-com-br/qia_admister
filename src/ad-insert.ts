import { AdRegistier } from "./ad-registier";
import { AdValued } from "./ad-valued";

export type AdInsert = {
  registier: AdRegistier;
  valueds: AdValued[];
  toGetID: string[];
};
