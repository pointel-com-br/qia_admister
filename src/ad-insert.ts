import { AdRegistier } from "./ad-registier";
import { AdToGetID } from "./ad-to-get-id";
import { AdValued } from "./ad-valued";

export type AdInsert = {
  registier: AdRegistier;
  valueds: AdValued[];
  toGetID: AdToGetID;
};
