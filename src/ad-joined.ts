import { AdFilter } from "./ad-filter";
import { AdRegistry } from "./ad-registry";
import { AdModule } from "./ad-tools";

export type AdJoined = {
  module: AdModule;
  ties?: AdJoinedTies;
  registry: AdRegistry;
  alias?: string;
  filters?: AdFilter[];
};

export enum AdJoinedTies {
  INNER,
  LEFT,
  RIGHT,
  FULL,
  CROSS,
}
