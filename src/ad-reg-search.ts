import {
  QinAsset,
  QinButton,
  QinColumn,
  QinCombo,
  QinComboItem,
  QinIcon,
  QinLine,
  QinScroll,
  QinString,
} from "qin_case";
import { AdField } from "./ad-field";
import { AdFilter, AdFilterLikes, AdFilterSeems, AdFilterTies } from "./ad-filter";
import { AdRegister } from "./ad-register";

export class AdRegSearch extends QinScroll {
  private _reg: AdRegister;
  private _lines = new QinColumn();
  private _clauses = new Array<SearchClause>();

  public idSelected: string;
  public lastSelected: string;

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
    this.idSelected = register.getIdentifier() + "-LastSearchSelected";
    this.lastSelected = this.qinpel.chief.loadConfig(this.idSelected);
    this._lines.install(this);
    const first = new SearchClause(this);
    this._clauses.push(first);
    first.install(this._lines);
  }

  public get reg(): AdRegister {
    return this._reg;
  }

  public addField(field: AdField) {
    this._clauses.forEach((clause) => {
      clause.addField({
        title: field.title,
        value: field.name,
        selected: field.name === this.lastSelected,
      });
    });
  }

  public addClause(after: SearchClause) {
    const clause = new SearchClause(this);
    this._reg.model.fields.forEach((field) => {
      clause.addField({
        title: field.title,
        value: field.name,
        selected: field.name === this.lastSelected,
      });
    });
    const index = this._clauses.indexOf(after);
    this._clauses.splice(index + 1, 0, clause);
    this.rebuild();
    clause.focus();
  }

  public delClause(clause: SearchClause) {
    if (this._clauses.length > 1) {
      const index = this._clauses.indexOf(clause);
      this._clauses.splice(index, 1);
      this.rebuild();
    } else {
      this._clauses[0].clean();
    }
  }

  private rebuild() {
    this._lines.unInstallChildren();
    this._clauses.forEach((clause) => {
      clause.install(this._lines);
    });
  }

  public getFilters(): AdFilter[] {
    let results: AdFilter[] = null;
    this._clauses.forEach((clause) => {
      let filter = clause.getFilter();
      if (filter) {
        if (!results) {
          results = [];
        }
        results.push(filter);
      }
    });
    return results;
  }

  public clean(): void {
    if (this._clauses.length > 1) {
      this._clauses.splice(1, this._clauses.length - 1);
      this.rebuild();
    }
    this._clauses[0].clean();
  }
}

class SearchClause extends QinLine {
  private _dad: AdRegSearch;

  private _qinSame = new SearchSame();
  private _qinField = new QinCombo();
  private _qinLikes = new SearchCondition();
  private _qinValue = new QinString();
  private _qinTies = new SearchTie();

  private _qinAdd = new QinButton({ icon: new QinIcon(QinAsset.FacePlus) });
  private _qinDel = new QinButton({ icon: new QinIcon(QinAsset.FaceMinus) });

  public constructor(dad: AdRegSearch) {
    super();
    this._dad = dad;
    this._qinSame.install(this);
    this._qinField.install(this);
    this._qinLikes.install(this);
    this._qinValue.install(this);
    this._qinTies.install(this);
    this._qinAdd.install(this);
    this._qinDel.install(this);
    this._qinField.addItem({ title: "", value: "" });
    this._qinField.addOnChanged((result) => {
      if (this._dad.lastSelected !== result) {
        this._dad.lastSelected = result;
        this.qinpel.chief.saveConfig(this._dad.idSelected, result);
      }
    });
    this._qinAdd.addActionMain((_) => {
      this._dad.addClause(this);
    });
    this._qinDel.addActionMain((_) => {
      this._dad.delClause(this);
    });
    this.style.putAsPaddingBottom(4);
    this.style.putAsBorderBottom(2, "#bbb");
    this.style.putAsMarginBottom(4);
  }

  public addField(item: QinComboItem) {
    this._qinField.addItem(item);
  }

  public clean() {
    this._qinSame.value = AdFilterSeems.SAME;
    this._qinLikes.value = AdFilterLikes.EQUALS;
    this._qinValue.value = null;
    this._qinTies.value = AdFilterTies.AND;
  }

  public getFilter(): AdFilter {
    let fieldName = this._qinField.value;
    if (!fieldName) {
      return null;
    }
    const field = this._dad.reg.model.getFieldByName(fieldName);
    if (!field) {
      return null;
    }
    return {
      seems: this._qinSame.value as AdFilterSeems,
      likes: this._qinLikes.value as AdFilterLikes,
      valued: {
        name: field.typed.alias || field.typed.name,
        type: field.typed.type,
        data: this._qinValue.value,
      },
      ties: this._qinTies.value as AdFilterTies,
    };
  }

  public focus() {
    if (!this._qinField.value) {
      this._qinField.focus();
    } else {
      this._qinValue.focus();
    }
  }
}

class SearchSame extends QinCombo {
  public constructor() {
    super();
    this.addItem({ title: "==", value: AdFilterSeems.SAME });
    this.addItem({ title: "!=", value: AdFilterSeems.DIVERSE });
    this.style.putAsMaxWidth(64);
  }
}

class SearchCondition extends QinCombo {
  public constructor() {
    super();
    this.addItem({ title: "=", value: AdFilterLikes.EQUALS });
    this.addItem({ title: ">", value: AdFilterLikes.BIGGER });
    this.addItem({ title: "<", value: AdFilterLikes.LESSER });
    this.addItem({ title: ">=", value: AdFilterLikes.BIGGER_EQUALS });
    this.addItem({ title: "<=", value: AdFilterLikes.LESSER_EQUALS });
    this.addItem({ title: "$_", value: AdFilterLikes.STARTS_WITH });
    this.addItem({ title: "_$", value: AdFilterLikes.ENDS_WITH });
    this.addItem({ title: "_$_", value: AdFilterLikes.CONTAINS, selected: true });
    this.style.putAsMaxWidth(64);
  }
}

class SearchTie extends QinCombo {
  public constructor() {
    super();
    this.addItem({ title: "&&", value: AdFilterTies.AND });
    this.addItem({ title: "||", value: AdFilterTies.OR });
    this.style.putAsMaxWidth(64);
  }
}
