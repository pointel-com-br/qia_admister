import { AdFilter } from "./ad-filter";
import { AdRegistry } from "./ad-registry";
import { AdModule } from "./ad-tools";

export type AdJoined = {
  module: AdModule;
  registry?: AdRegistry;
  alias?: string;
  filters?: AdFilter[];
  ties?: AdJoinedTies;
};

export enum AdJoinedTies {
  INNER = "INNER",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  FULL = "FULL",
  CROSS = "CROSS",
}
