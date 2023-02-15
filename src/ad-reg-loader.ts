import { AdApprise } from "./ad-apprise";
import { AdFilter, AdFilterLikes, AdFilterSeems, AdFilterTies } from "./ad-filter";
import { AdJoinedTies } from "./ad-joined";
import { AdRegCalls } from "./ad-reg-calls";
import { AdRegister } from "./ad-register";
import { AdSelect } from "./ad-select";
import { AdValued } from "./ad-valued";

export class AdRegLoader {
  private _reg: AdRegister;

  public constructor(register: AdRegister) {
    this._reg = register;
  }

  public refresh(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const query = this.mountSelect(false);
      if (!query.filters) {
        query.filters = [];
      }
      for (const field of this._reg.model.fields) {
        if (field.key) {
          let filter: AdFilter = {
            seems: AdFilterSeems.SAME,
            likes: AdFilterLikes.EQUALS,
            valued: field.valued,
          };
          query.filters.push(filter);
        }
      }
      AdRegCalls.select(query)
        .then((rows) => {
          if (rows.length == 0) {
            this._reg.displayInfo(AdApprise.NO_RESULTS_FOUND, "{qia_admister}(ErrCode-000018)");
          } else {
            this._reg.refreshSelected(rows[0]);
          }
          resolve();
        })
        .catch((err) => reject(err));
    });
  }

  public load(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const query = this.mountSelect();
      AdRegCalls.select(query)
        .then((rows) => {
          this._reg
            .unselectAll()
            .then(() => {
              this._reg.table.delLines();
              if (rows.length == 0) {
                this._reg.displayInfo(
                  AdApprise.NO_RESULTS_FOUND,
                  "{qia_admister}(ErrCode-000008)"
                );
              } else {
                for (let row of rows) {
                  this._reg.table.addLine(row);
                }
              }
              resolve();
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    });
  }

  public mountSelect(
    addSearchFilters: boolean = true,
    plusFilters: AdValued[] = null
  ): AdSelect {
    let registier = this._reg.registier;
    let fields = this._reg.model.typeds;
    let joins = this._reg.based.joins;
    if (joins) {
      for (let join of joins) {
        if (!join.registry) {
          join.registry = join.module.registry;
        }
        if (!join.ties) {
          join.ties = AdJoinedTies.LEFT;
        }
      }
    }
    let filters: AdFilter[] = [];
    if (this._reg.based.filters) {
      filters.push(...this._reg.based.filters);
    }
    if (this._reg.expect.filters) {
      filters.push(...this._reg.expect.filters);
    }
    if (addSearchFilters) {
      let searchFilters = this._reg.search.getFilters();
      if (searchFilters) {
        filters.push(...searchFilters);
      }
    }
    if (plusFilters) {
      for (const valued of plusFilters) {
        let filter: AdFilter = {
          seems: AdFilterSeems.SAME,
          likes: AdFilterLikes.EQUALS,
          valued: valued,
          ties: AdFilterTies.AND,
        };
        filters.push(filter);
      }
    }
    let orders = this._reg.based.orders;
    let result: AdSelect = { registier, fields, joins, filters, orders, limit: 300 };
    return result;
  }
}
