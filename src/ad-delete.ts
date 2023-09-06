import { AdFilter } from "./ad-filter";
import { AdRegistier } from "./ad-registier";

export type AdDelete = {
    registier: AdRegistier;
    filters: AdFilter[];
};
