import { AdRegistry } from "./ad-registry";
import { AdValued } from "./ad-valued";

export type AdInsert = {
  registry: AdRegistry;
  valueds: AdValued[];
};
