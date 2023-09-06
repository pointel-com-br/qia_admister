import { QinBase, QinColumn, QinLine, QinScroll, QinTabs } from "qin_case";
import { AdField } from "./ad-field";
import { AdRegister } from "./ad-register";

export class AdRegEditor extends QinScroll {
    private _reg: AdRegister;
    private _body = new QinColumn();

    private _tabs: QinTabs = null;
    private _column: QinColumn = null;
    private _line: QinLine = null;

    private _acts: QinLine = null;

    public constructor(register: AdRegister) {
        super();
        this._reg = register;
        this._body.install(this);
        this._body.styled({ display: "block" });
    }

    public addTab(title: string) {
        if (this._tabs == null) {
            this._tabs = new QinTabs();
            this._tabs.install(this._body);
            this._tabs.styleAsMarginTop(3);
        }
        this._column = new QinColumn();
        this._tabs.addTab({ title, viewer: this._column });
        this._line = new QinLine();
        this._line.install(this._column);
    }

    public addLine() {
        if (this._column == null) {
            this._column = new QinColumn();
            this._column.install(this._body);
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
            this._acts.install(this._body);
        }
        kindred.install(this._acts);
    }
}
