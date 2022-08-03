import { QinWaiters } from "qin_soul";
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

  private replaceAllScopeWithEachOne() {
    if (this._scopes.findIndex((s) => s == AdScope.ALL) > -1) {
      let hasRelate = this._scopes.findIndex((s) => s == AdScope.ALL) > -1;
      this._scopes = [
        AdScope.INSERT,
        AdScope.SEARCH,
        AdScope.NOTICE,
        AdScope.MUTATE,
        AdScope.DELETE,
      ];
      if (hasRelate) {
        this._scopes.push(AdScope.RELATE);
      }
    }
  }

  public restrictInsert() {
    this.replaceAllScopeWithEachOne();
    this._scopes = this._scopes.filter((s) => s != AdScope.INSERT);
  }

  public restrictSelect() {
    this.replaceAllScopeWithEachOne();
    this._scopes = this._scopes.filter((s) => s != AdScope.SEARCH && s != AdScope.NOTICE);
  }

  public restrictUpdate() {
    this.replaceAllScopeWithEachOne();
    this._scopes = this._scopes.filter((s) => s != AdScope.MUTATE);
  }

  public restrictDelete() {
    this.replaceAllScopeWithEachOne();
    this._scopes = this._scopes.filter((s) => s != AdScope.DELETE);
  }

  public hasScope(scope: AdScope): boolean {
    return this._scopes.findIndex((s) => s == AdScope.ALL || s == scope) > -1;
  }
}

export type AdExpectSet = {
  scopes: AdScope[];
  filters?: AdFilter[];
};
