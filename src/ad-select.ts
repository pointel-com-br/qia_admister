import { AdFilter } from "./ad-filter";
import { AdJoined } from "./ad-joined";
import { AdOrder } from "./ad-order";
import { AdRegistier } from "./ad-registier";
import { AdTyped } from "./ad-typed";

export type AdSelect = {
    registier: AdRegistier;
    fields?: AdTyped[];
    joins?: AdJoined[];
    filters?: AdFilter[];
    orders?: AdOrder[];
    offset?: number;
    limit?: number;
};
