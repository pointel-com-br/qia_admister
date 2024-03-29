import { QinWaiters } from "qin_soul";
import { AdFilter } from "./ad-filter";
import { AdPrepare } from "./ad-prepare";
import { AdScope } from "./ad-tools";
import { AdValued } from "./ad-valued";

export class AdExpect {
    private _scopes: AdScope[];
    private _filters: AdFilter[];
    private _fixed: AdValued[];
    private _prepare: AdPrepare[];
    private _waiters: QinWaiters<any>;

    public constructor(options: AdExpectSet) {
        this._scopes = options.scopes;
        this._filters = options.filters;
        this._fixed = options.fixed;
        this._prepare = options.prepare;
        this._waiters = options.waiters;
    }

    public get scopes(): AdScope[] {
        return this._scopes;
    }

    public get filters(): AdFilter[] {
        return this._filters;
    }

    public get fixed(): AdValued[] {
        return this._fixed;
    }

    public get prepare(): AdPrepare[] {
        return this._prepare;
    }

    public get waiters(): QinWaiters<any> {
        return this._waiters;
    }

    private replaceAllScopeWithEachOne() {
        if (this._scopes.findIndex((s) => s == AdScope.ALL) > -1) {
            let hasRelate = this._scopes.findIndex((s) => s == AdScope.RELATE) > -1;
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
    fixed?: AdValued[];
    prepare?: AdPrepare[];
    waiters?: QinWaiters<any>;
};
