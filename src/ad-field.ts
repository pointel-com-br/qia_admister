import { QinBase, QinEdit, QinLabel, QinMutants, QinMutantsArm, QinRows } from "qin_case";
import { QinWaiter } from "qin_soul";
import { AdTyped } from "./ad-typed";
import { AdValued } from "./ad-valued";

export class AdField {
    private _key: boolean;
    private _title: string;
    private _name: string;
    private _alias: string;
    private _kind: QinMutants;
    private _options: any;

    private _readOnly: boolean;

    private _rows: QinRows;
    private _label: QinLabel;
    private _edit: QinEdit<any> = null;
    private _typed: AdTyped = null;

    private _value: any = null;
    private _fixedValue: any = null;
    private _defaultValue: any = null;

    constructor(newer: AdFieldSet) {
        this._key = newer.key ?? false;
        this._title = newer.title;
        this._name = newer.name;
        this._alias = newer.alias;
        this._kind = newer.kind;
        this._options = newer.options;
        this._readOnly = newer.readOnly ?? false;
        this.init(newer);
    }

    private init(newer: AdFieldSet) {
        this._rows = new QinRows({ size: 2 });
        this._rows.styleAsMargin(3);
        this._label = new QinLabel(this._title);
        this._rows.putOn(0, this._label);
        this._edit = QinMutantsArm.newEdit(this._kind, this._options);
        this._rows.putOn(1, this._edit);
        this._typed = {
            name: this._name,
            type: this._edit.getNature(),
            alias: this._alias,
        };
        this.value = newer.initialValue;
        this.fixedValue = newer.fixedValue;
        this.defaultValue = newer.defaultValue;
    }

    public get key(): boolean {
        return this._key;
    }

    public get title(): string {
        return this._title;
    }

    public get name(): string {
        return this._name;
    }

    public get kind(): QinMutants {
        return this._kind;
    }

    public get alias(): string {
        return this._alias;
    }

    public get options(): any {
        return this._options;
    }

    public get readOnly(): boolean {
        return this._readOnly;
    }

    public get rows(): QinRows {
        return this._rows;
    }

    public get label(): QinLabel {
        return this._label;
    }

    public get edit(): QinEdit<any> {
        return this._edit;
    }

    public get typed(): AdTyped {
        return this._typed;
    }

    public get valued(): AdValued {
        let name = this._name;
        let type = this._edit.getNature();
        let data = this._edit.value;
        if (data === "") {
            data = null;
        }
        return { name, type, data };
    }

    public get value(): any {
        const value = this.isFixedValue() ? this.fixedValue : this._edit.value;
        if (this._edit.value != value) {
            this._edit.value = value;
        }
        this._value = value;
        return value;
    }

    public set value(data: any) {
        const newValue = this.isFixedValue() ? this.fixedValue : data;
        this._edit.value = newValue;
        this._value = this._edit.value;
    }

    public get fixedValue(): any {
        return this._fixedValue;
    }

    public set fixedValue(data: any) {
        this._fixedValue = data;
        this.value = data;
    }

    public isFixedValue(): boolean {
        return this._fixedValue !== null && this._fixedValue !== undefined;
    }

    public get defaultValue(): any {
        return this._defaultValue;
    }

    public set defaultValue(data: any) {
        this._defaultValue = data;
        this.value = data;
    }

    public hasDefaultValue(): boolean {
        return this._defaultValue !== null && this._defaultValue !== undefined;
    }

    public get fieldSource(): string {
        let dotPos = this._name.indexOf(".");
        if (dotPos < 0) {
            return "";
        }
        return this._name.substring(0, dotPos);
    }

    public putKey(): AdField {
        this._key = true;
        return this;
    }

    public putDataSource(dataSource: string): AdField {
        this._name = dataSource + "." + this._name;
        return this;
    }

    public putReadOnly(): AdField {
        this._readOnly = true;
        return this;
    }

    public putOnEntered(waiter: QinWaiter<any>): AdField {
        this._edit.addOnEntered(waiter);
        return this;
    }

    public putOnChanged(waiter: QinWaiter<any>): AdField {
        this._edit.addOnChanged(waiter);
        return this;
    }

    public putOnExited(waiter: QinWaiter<any>): AdField {
        this._edit.addOnExited(waiter);
        return this;
    }

    public install(on: QinBase) {
        this._rows.install(on);
    }

    public hasMutations(): boolean {
        if (this.isFixedValue()) {
            return false;
        }
        let early = this._value;
        if (early === "") {
            early = null;
        }
        let byNow = this.value;
        if (byNow === "") {
            byNow = null;
        }
        return early !== byNow;
    }

    public hasValue(): boolean {
        return !!this.value;
    }

    public undoMutations() {
        this._edit.value = this._value;
    }

    public clean() {
        const newValue = this.isFixedValue()
            ? this.fixedValue
            : this.hasDefaultValue()
            ? this.defaultValue
            : null;
        this.value = newValue;
    }

    public saved() {
        this._value = this.value;
    }

    public turnReadOnly() {
        this._edit.turnReadOnly();
    }

    public turnEditable() {
        this._edit.turnEditable();
    }

    public isEditable() {
        this._edit.isEditable();
    }

    public focus() {
        this._edit.focus();
    }
}

export type AdFieldSet = {
    key?: boolean;
    title?: string;
    name: string;
    alias?: string;
    kind: QinMutants;
    options?: any;
    readOnly?: boolean;
    initialValue?: any;
    fixedValue?: any;
    defaultValue?: any;
};
