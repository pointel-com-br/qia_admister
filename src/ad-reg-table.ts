import { QinTable } from "qinpel-cps";
import { AdRegister } from "./ad-register";

export class AdRegTable extends QinTable {
  private _reg: AdRegister;

  public constructor(register: AdRegister) {
    super({ singleSelection: true });
    this._reg = register;
    this.addOnLineMainAct((row, values: string[]) => {
      this._reg.tryTurnNoticeRow(row, values);
    });
  }
}
