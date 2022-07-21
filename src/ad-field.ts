import { QinBase, QinEdit, QinLabel, QinMutants, QinMutantsArm, QinRows } from "qinpel-cps";
import { QinWaiter } from "qinpel-res";
import { AdTyped } from "./ad-typed";
import { AdValued } from "./ad-valued";

export class AdField {
  private _key: boolean;
  private _title: string;
  private _name: string;
  private _alias: string;
  private _kind: QinMutants;
  private _options: any;

  private _rows: QinRows;
  private _label: QinLabel;
  private _edit: QinEdit<any> = null;
  private _typed: AdTyped = null;

  private _value: any = null;

  constructor(newer: AdFieldSet) {
    this._key = newer.key ?? false;
    this._title = newer.title;
    this._name = newer.name;
    this._alias = newer.alias;
    this._kind = newer.kind;
    this._options = newer.options;
    this.init();
  }

  private init() {
    this._rows = new QinRows({ size: 2 });
    this._rows.style.putAsMargin(3);
    this._label = new QinLabel(this._title);
    this._rows.putOn(0, this._label);
    this._edit = QinMutantsArm.newEdit(this._kind, this._options);
    this._rows.putOn(1, this._edit);
    this._typed = {
      name: this._name,
      type: this._edit.getNature(),
      alias: this._alias,
    };
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
    return { name, type, data };
  }

  public get value(): any {
    let result = this._edit.value;
    if (result === "") {
      result = null;
    }
    return result;
  }

  public set value(data: any) {
    this._edit.value = data;
    this._value = data;
  }

  public get source(): string {
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

  public install(on: QinBase) {
    this._rows.install(on);
  }

  public hasMutations(): boolean {
    let early = this._value;
    let byNow = this.value;
    return early != byNow;
  }

  public undoMutations() {
    this._edit.value = this._value;
  }

  public clean() {
    this.value = null;
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

  public addOnChanged(waiter: QinWaiter) {
    this._edit.addOnChanged(waiter);
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
};
