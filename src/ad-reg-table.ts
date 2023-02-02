import { QinTable } from "qin_case";
import { AdRegister } from "./ad-register";

export class AdRegTable extends QinTable {
  private _reg: AdRegister;

  public constructor(register: AdRegister) {
    super({ singleSelection: true });
    this._reg = register;
    this.styleAsWhiteSpaceNoWrap();
    this.addOnLineMainAct((row, values: string[]) => {
      this._reg.tryTurnNoticeRow(row, values);
    });
  }
}
