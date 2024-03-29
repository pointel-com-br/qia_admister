import { AdDelete } from "./ad-delete";
import { AdField } from "./ad-field";
import { AdFilter, AdFilterLikes, AdFilterSeems, AdFilterTies } from "./ad-filter";
import { AdInsert } from "./ad-insert";
import { AdRegCalls } from "./ad-reg-calls";
import { AdRegister } from "./ad-register";
import { AdRegistier } from "./ad-registier";
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

    public getValue(index: number): any {
        return this._fields[index].value;
    }

    public setValues(values: any[]) {
        for (let i = 0; i < values.length; i++) {
            this.setValue(i, values[i]);
        }
    }

    public getValues(): any[] {
        let result = [];
        for (const field of this._fields) {
            result.push(field.value);
        }
        return result;
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

    public async insert(): Promise<AdRegKeys> {
        return new Promise<AdRegKeys>((resolve, reject) => {
            let valueds = new Array<AdValued>();
            let regKeys = new Array<AdValued>();
            let toGetID: AdToGetID = {};
            for (let field of this._fields) {
                let valued = field.valued;
                if (valued.name.indexOf(".") === -1) {
                    if (valued.data || field.key) {
                        valueds.push(valued);
                    }
                    if (field.key) {
                        regKeys.push(valued);
                        if (!valued.data) {
                            toGetID.name = field.name;
                        } else {
                            toGetID.filter = valued;
                        }
                    }
                }
            }
            let query: AdInsert = {
                registier: this._reg.registier,
                valueds,
                toGetID,
            };
            AdRegCalls.insert(query)
                .then((id) => {
                    if (toGetID && toGetID.name) {
                        for (let valued of regKeys) {
                            if (valued.name === toGetID.name) {
                                valued.data = id;
                                break;
                            }
                        }
                    }
                    resolve(regKeys);
                })
                .catch((err) => reject(err));
        });
    }

    public async update(): Promise<AdRegKeys> {
        return new Promise<AdRegKeys>((resolve, reject) => {
            let valueds = new Array<AdValued>();
            let regKeys = new Array<AdValued>();
            for (let field of this._fields) {
                let valued = field.valued;
                valueds.push(valued);
                if (field.key) {
                    regKeys.push(valued);
                }
            }
            let query: AdUpdate = {
                registier: this._reg.registier,
                valueds: this.getMutationValueds(),
                filters: this.getKeyFieldsFilter(),
            };
            AdRegCalls.update(query)
                .then((_) => {
                    for (let field of this._fields) {
                        field.saved();
                    }
                    resolve(regKeys);
                })
                .catch((err) => reject(err));
        });
    }

    public async delete(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let detailsPromise = new Array<Promise<number>>();
            for (const detail of this._reg.details) {
                let registier: AdRegistier = {
                    base: this._reg.registier.base,
                    registry: detail.setup.module.registry,
                };
                let deleteDetail: AdDelete = {
                    registier,
                    filters: [],
                };
                if (detail.setup.filters) {
                    for (const filter of detail.setup.filters) {
                        if (filter.linked) {
                            let indexField = this._reg.model.getFieldIndexByName(
                                filter.linked.with
                            );
                            let fixedValue = this._reg.selectedValues[indexField];
                            deleteDetail.filters.push({
                                seems: AdFilterSeems.SAME,
                                likes: AdFilterLikes.EQUALS,
                                valued: {
                                    name: filter.linked.name,
                                    type: this._reg.model.fields[indexField].typed.type,
                                    data: fixedValue,
                                },
                                ties: AdFilterTies.AND,
                            });
                        } else {
                            deleteDetail.filters.push(filter);
                        }
                    }
                }
                if (deleteDetail.filters.length > 0) {
                    detailsPromise.push(AdRegCalls.delete(deleteDetail));
                }
            }
            let deleteQuery: AdDelete = {
                registier: this._reg.registier,
                filters: this.getKeyFieldsFilter(),
            };
            Promise.all(detailsPromise)
                .then((_) => {
                    AdRegCalls.delete(deleteQuery)
                        .then((_) => {
                            this.clean();
                            resolve();
                        })
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
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

export type AdRegKeys = AdValued[];
