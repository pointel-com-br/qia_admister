import { AdDelete } from "./ad-delete";
import { AdField } from "./ad-field";
import { AdFilter, AdFilterLikes, AdFilterSeems, AdFilterTies } from "./ad-filter";
import { AdInsert } from "./ad-insert";
import { AdRegister } from "./ad-register";
import { AdToGetID } from "./ad-to-get-id";
import { AdTyped } from "./ad-typed";
import { AdUpdate } from "./ad-update";
import { AdValued } from "./ad-valued";

export class AdRegModel {
  private _reg: AdRegister;
  private _fields: AdField[] = [];
  private _typeds: AdTyped[] = null;

  public constructor(register: AdRegister) {
    this._reg = register;
  }

  public get fields(): AdField[] {
    return this._fields;
  }

  public get typeds(): AdTyped[] {
    if (this._typeds == null) {
      this._typeds = [];
      for (let field of this._fields) {
        this._typeds.push(field.typed);
      }
    }
    return this._typeds;
  }

  public addField(field: AdField) {
    this._fields.push(field);
  }

  public getFieldByName(name: string): AdField {
    for (let field of this._fields) {
      if (field.name === name) {
        return field;
      }
    }
    return null;
  }

  public getFieldIndexByName(name: string): number {
    for (let i = 0; i < this._fields.length; i++) {
      if (this._fields[i].name === name) {
        return i;
      }
    }
    return -1;
  }

  public setValue(index: number, value: any) {
    this._fields[index].value = value;
  }

  public setValues(values: any[]) {
    for (let i = 0; i < values.length; i++) {
      this.setValue(i, values[i]);
    }
  }

  public clean() {
    for (let field of this._fields) {
      field.clean();
    }
  }

  public turnReadOnly() {
    for (let field of this._fields) {
      field.turnReadOnly();
    }
  }

  public turnEditable() {
    for (let field of this._fields) {
      if (!field.readOnly) {
        field.turnEditable();
      } else {
        field.turnReadOnly();
      }
    }
  }

  public hasMutations(): string[] {
    let result: Array<string> = null;
    for (let field of this._fields) {
      if (field.hasMutations()) {
        if (result == null) {
          result = [];
        }
        result.push(field.title);
      }
    }
    return result;
  }

  public undoMutations() {
    for (let field of this._fields) {
      field.undoMutations();
    }
  }

  public async insert(): Promise<AdValued[]> {
    return new Promise<AdValued[]>((resolve, reject) => {
      let valueds = new Array<AdValued>();
      let results = new Array<AdValued>();
      let toGetID: AdToGetID = {};
      for (let field of this._fields) {
        let valued = field.valued;
        if (valued.name.indexOf(".") === -1) {
          valueds.push(valued);
          if (field.key) {
            if (!valued.data) {
              toGetID.name = field.name;
            } else {
              toGetID.filter = valued;
            }
          }
        }
        results.push(valued);
      }
      let inserting = {
        registier: this._reg.registier,
        valueds,
        toGetID,
      } as AdInsert;
      this._reg.qinpel.chief.talk
        .post("/reg/new", inserting)
        .then((res) => {
          if (toGetID && toGetID.name) {
            for (let valued of results) {
              if (valued.name === toGetID.name) {
                valued.data = res.data;
                break;
              }
            }
          }
          resolve(results);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async update(): Promise<AdValued[]> {
    return new Promise<AdValued[]>((resolve, reject) => {
      let valueds = new Array<AdValued>();
      for (let field of this._fields) {
        valueds.push(field.valued);
      }
      let updating = {
        registier: this._reg.registier,
        valueds: this.getMutationValueds(),
        filters: this.getKeyFieldsFilter(),
      } as AdUpdate;
      this._reg.qinpel.chief.talk
        .post("/reg/set", updating)
        .then((_) => {
          for (let field of this._fields) {
            field.saved();
          }
          resolve(valueds);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async delete(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let deleting = {
        registier: this._reg.registier,
        filters: this.getKeyFieldsFilter(),
      } as AdDelete;
      this._reg.qinpel.chief.talk
        .post("/reg/del", deleting)
        .then((_) => {
          this.clean();
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private getMutationValueds(): AdValued[] {
    let result = [];
    for (let field of this._fields) {
      if (field.hasMutations() && !field.key) {
        result.push(field.valued);
      }
    }
    return result;
  }

  private getKeyFieldsFilter(): AdFilter[] {
    let result: AdFilter[] = [];
    for (let field of this._fields) {
      if (field.key) {
        let filter = {
          seems: AdFilterSeems.SAME,
          likes: AdFilterLikes.EQUALS,
          valued: field.valued,
          ties: AdFilterTies.AND,
        };
        result.push(filter);
      }
    }
    return result;
  }
}
