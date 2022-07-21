import { QinWaiters } from "qinpel-res";
import { AdFilter } from "./ad-filter";
import { AdScope } from "./ad-tools";

export class AdExpect {
  private _scopes: AdScope[];
  private _filters: AdFilter[];
  private _waiters: QinWaiters;

  public constructor(options: AdExpectSet) {
    this._scopes = options.scopes;
    this._filters = options.filters;
  }

  public get scopes(): AdScope[] {
    return this._scopes;
  }

  public get filters(): AdFilter[] {
    return this._filters;
  }

  public get waiters(): QinWaiters {
    return this._waiters;
  }
}

export type AdExpectSet = {
  scopes: AdScope[];
  filters?: AdFilter[];
};
