import { QinBase, QinColumn, QinLine, QinTabs } from "qin_case";
import { AdField } from "./ad-field";
import { AdRegister } from "./ad-register";

export class AdRegEditor extends QinColumn {
  private _reg: AdRegister;

  private _tabs: QinTabs = null;
  private _column: QinColumn = null;
  private _line: QinLine = null;

  private _acts: QinLine = null;

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
  }

  public addTab(title: string) {
    if (this._tabs == null) {
      this._tabs = new QinTabs();
      this._tabs.install(this);
      this._tabs.style.putAsMarginTop(3);
    }
    this._column = new QinColumn();
    this._tabs.addTab({ title, viewer: this._column });
    this._line = new QinLine();
    this._line.install(this._column);
  }

  public addLine() {
    if (this._column == null) {
      this._column = new QinColumn();
      this._column.install(this);
    }
    this._line = new QinLine();
    this._line.install(this._column);
  }

  public addField(field: AdField) {
    if (this._line == null) {
      this.addLine();
    }
    field.install(this._line);
  }

  public addAct(kindred: QinBase) {
    if (this._acts == null) {
      this._acts = new QinLine();
      this._acts.install(this);
    }
    kindred.install(this._acts);
  }
}
