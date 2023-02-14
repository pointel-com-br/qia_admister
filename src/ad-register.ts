import {
  QinAsset,
  QinBase,
  QinButton,
  QinColumn,
  QinIcon,
  QinLabel,
  QinSplitter,
  QinStack
} from "qin_case";
import { QinAction } from "qin_soul";
import { AdApprise, AdApprised } from "./ad-apprise";
import { AdExpect } from "./ad-expect";
import { AdField } from "./ad-field";
import { AdFilter, AdFilterLikes, AdFilterSeems, AdFilterTies } from "./ad-filter";
import { AdJoined } from "./ad-joined";
import { AdRegBar } from "./ad-reg-bar";
import { AdRegBased } from "./ad-reg-based";
import { AdRegCalls } from "./ad-reg-calls";
import { AdRegEditor } from "./ad-reg-editor";
import { AdRegLoader } from "./ad-reg-loader";
import { AdRegModel } from "./ad-reg-model";
import { AdRegSearch } from "./ad-reg-search";
import { AdRegTable } from "./ad-reg-table";
import { AdRegistier } from "./ad-registier";
import { AdSelect } from "./ad-select";
import { AdModule, AdScope, AdSetup, AdTools } from "./ad-tools";
import { AdTyped } from "./ad-typed";
import { AdValued } from "./ad-valued";

export class AdRegister extends QinColumn {
  private _module: AdModule;
  private _expect: AdExpect;
  private _based: AdRegBased;
  private _model: AdRegModel;
  private _identifier: string;

  private _body: QinStack;
  private _viewSingle: QinStack;
  private _viewVertical: QinSplitter;
  private _viewHorizontal: QinSplitter;

  private _bar: AdRegBar;
  private _editor: AdRegEditor;
  private _search: AdRegSearch;
  private _table: AdRegTable;

  private _loader: AdRegLoader;

  private _regMode: AdRegMode;
  private _regView: AdRegView;
  private _selectedRow: number = -1;
  private _selectedValues: string[] = null;

  private _details = new Array<AdRegDetail>();

  private _listener = new Array<AdRegListener>();
  private _enableJoins = true;

  public constructor(module: AdModule, expect: AdExpect, based: AdRegBased) {
    super();
    this.unVisible();
    this._module = module;
    this._expect = expect;
    this._based = based;
    this._identifier =
      module.appName +
      "," +
      module.title +
      "," +
      based.registier.base +
      "," +
      based.registier.registry.catalog +
      "," +
      based.registier.registry.schema +
      "," +
      based.registier.registry.name +
      "," +
      based.registier.registry.alias;
    this._model = new AdRegModel(this);
    this._body = new QinStack();
    this._viewSingle = new QinStack();
    this._viewVertical = new QinSplitter({ horizontal: false });
    this._viewHorizontal = new QinSplitter({ horizontal: true });
    this._bar = new AdRegBar(this);
    this._editor = new AdRegEditor(this);
    this._search = new AdRegSearch(this);
    this._table = new AdRegTable(this);
    this._loader = new AdRegLoader(this);
    this.initInterface();
  }

  private initInterface() {
    this._viewSingle.styleAsFlexMax();
    this._viewVertical.styleAsFlexMax();
    this._viewHorizontal.styleAsFlexMax();
    this._bar.install(this);
    this._body.stack(this._editor);
    this._body.stack(this._search);
    this._body.styleAsFlexMax();
    this._editor.styleAsFlexMax();
    this._search.styleAsFlexMax();
    this._table.styleAsFlexMax();
    this._bar.tabIndex = 0;
    this._body.tabIndex = 1;
    this._table.tabIndex = 2;
    this.initViewSchema();
    this.addActionKey(["esc", "escape"], (_) => {
      this.tryCancel().then((_) => this.qinpel.jobbed.close());
    });
  }

  private initViewSchema() {
    let sideA = parseInt(
      this.qinpel.chief.loadConfig(
        this._identifier + "-" + AdRegParams.VIEW_VERTICAL_SIDE_A,
        "50"
      )
    );
    let sideB = parseInt(
      this.qinpel.chief.loadConfig(
        this._identifier + "-" + AdRegParams.VIEW_VERTICAL_SIDE_B,
        "50"
      )
    );
    this._viewVertical.setBalance({ sideA, sideB });
    sideA = parseInt(
      this.qinpel.chief.loadConfig(
        this._identifier + "-" + AdRegParams.VIEW_HORIZONTAL_SIDE_A,
        "50"
      )
    );
    sideB = parseInt(
      this.qinpel.chief.loadConfig(
        this._identifier + "-" + AdRegParams.VIEW_HORIZONTAL_SIDE_B,
        "50"
      )
    );
    this._viewHorizontal.setBalance({ sideA, sideB });
    let selectedView = this.qinpel.chief.loadConfig(
      this._identifier + "-" + AdRegParams.VIEW_SELECTED,
      AdRegParams.VIEW_SELECTED_VERTICAL
    );
    if (selectedView === AdRegParams.VIEW_SELECTED_SINGLE) {
      this.viewSingle();
    } else if (selectedView === AdRegParams.VIEW_SELECTED_HORIZONTAL) {
      this.viewHorizontal();
    } else {
      this.viewVertical();
    }
    this.initSaveBalances();
  }

  private initSaveBalances() {
    this._viewVertical.addOnChanged((balance) => {
      this.qinpel.chief.saveConfig(
        this._identifier + "-" + AdRegParams.VIEW_VERTICAL_SIDE_A,
        balance.sideA.toString()
      );
      this.qinpel.chief.saveConfig(
        this._identifier + "-" + AdRegParams.VIEW_VERTICAL_SIDE_B,
        balance.sideB.toString()
      );
    });
    this._viewHorizontal.addOnChanged((balance) => {
      this.qinpel.chief.saveConfig(
        this._identifier + "-" + AdRegParams.VIEW_HORIZONTAL_SIDE_A,
        balance.sideA.toString()
      );
      this.qinpel.chief.saveConfig(
        this._identifier + "-" + AdRegParams.VIEW_HORIZONTAL_SIDE_B,
        balance.sideB.toString()
      );
    });
  }

  public get module(): AdModule {
    return this._module;
  }

  public get based(): AdRegBased {
    return this._based;
  }

  public get registier(): AdRegistier {
    return this._based.registier;
  }

  public get expect(): AdExpect {
    return this._expect;
  }

  public get model(): AdRegModel {
    return this._model;
  }

  public get identifier(): string {
    return this._identifier;
  }

  public get regMode(): AdRegMode {
    return this._regMode;
  }

  public get regModeEditable(): boolean {
    return this.regMode != AdRegMode.NOTICE;
  }

  public get regView(): AdRegView {
    return this._regView;
  }

  public get bar(): AdRegBar {
    return this._bar;
  }

  public get editor(): AdRegEditor {
    return this._editor;
  }

  public get search(): AdRegSearch {
    return this._search;
  }

  public get table(): AdRegTable {
    return this._table;
  }

  public get loader(): AdRegLoader {
    return this._loader;
  }

  public get dataSource(): string {
    return this._based.registier.registry.alias ?? this._based.registier.registry.name;
  }

  public get details(): AdRegDetail[] {
    return this._details;
  }

  public get selectedValues(): string[] {
    return this._selectedValues;
  }

  public addTab(title: string) {
    this._editor.addTab(title);
  }

  public addLine() {
    this._editor.addLine();
  }

  public addFields(fields: AdField[]) {
    for (const field of fields) {
      this.addField(field);
    }
  }

  public addField(field: AdField) {
    if (field.name.indexOf(".") > -1) {
      field.putReadOnly();
    }
    this._model.addField(field);
    this._editor.addField(field);
    this._search.addField(field);
    this._table.addHead(field.title);
  }

  public addAct(kindred: QinBase) {
    this._editor.addAct(kindred);
  }

  public addDetail(detail: AdRegDetail) {
    const detailTitle = detail.title ?? detail.setup.module.title;
    let button = new QinButton({ label: new QinLabel(detailTitle) });
    button.addActionMain((_) => {
      this.tryConfirm().then((_) => {
        if (!this.hasRowSelected()) {
          this.qinpel.jobbed.showError(
            "You must select a row before show the details of " + detailTitle,
            "{qia_admister}(ErrCode-000015)"
          );
          return;
        }
        let detailFilters: AdFilter[] = [];
        let detailFixed: AdValued[] = [];
        if (detail.setup.filters) {
          for (let filter of detail.setup.filters) {
            if (filter.linked) {
              let indexField = this._model.getFieldIndexByName(filter.linked.with);
              let fixedValue = this._selectedValues[indexField];
              detailFilters.push({
                seems: AdFilterSeems.SAME,
                likes: AdFilterLikes.EQUALS,
                valued: {
                  name: filter.linked.name,
                  type: this._model.fields[indexField].typed.type,
                  data: fixedValue,
                },
                ties: AdFilterTies.AND,
              });
              detailFixed.push({
                name: filter.linked.name,
                data: fixedValue,
              });
            } else {
              detailFilters.push(filter);
            }
          }
        }
        this.qinpel.chief.newJobber(
          detailTitle,
          detail.setup.module.appName,
          AdTools.newAdSetupOption(
            detail.setup.module,
            detail.setup.scopes,
            detailFilters,
            detailFixed
          )
        );
      });
    });
    this._editor.addAct(button);
    this._details.push(detail);
  }

  public prepare() {
    this.qinpel.jobbed.addOnFocusGain(() => {
      if (this._regMode == AdRegMode.NOTICE) {
        this.tryRefresh().catch((err) =>
          this.qinpel.jobbed.showError(err, "{qia_admister}(ErrCode-000017)")
        );
      }
    });
    if (this._expect.fixed) {
      this.initFixed();
    }
    if (this._based.joins) {
      this.initJoins();
    }
    this.applyPermissions();
  }

  private initFixed() {
    for (const fixed of this._expect.fixed) {
      const field = this.model.getFieldByName(fixed.name);
      if (!field) {
        this.qinpel.jobbed.showError(
          "Could not set the fixed value for field " + fixed.name + ".",
          "{qia_admister}(ErrCode-000019)"
        );
        continue;
      }
      field.fixed = fixed.data;
    }
  }

  private initJoins() {
    this._based.joins.forEach((join) => {
      if (join.filters) {
        let allLinkedFields = new Array<AdField>();
        let allLinkedWith = new Array<string>();
        join.filters.forEach((filter) => {
          if (filter.linked) {
            let linkedField = this._model.getFieldByName(filter.linked.name);
            linkedField.putOnChanged((_) => {
              if (this.regModeEditable && this._enableJoins) {
                this.updateJoined(join);
              }
            });
            allLinkedFields.push(linkedField);
            allLinkedWith.push(filter.linked.with);
          }
        });
        if (allLinkedFields.length > 0) {
          let actionRelater: QinAction = (_) => {
            let jobber = this.qinpel.chief.newJobber(
              join.module.title,
              join.module.appName,
              AdTools.newAdSetupOption(join.module, [AdScope.RELATE])
            );
            jobber.addWaiter((res) => {
              if (!this.regModeEditable) {
                this.qinpel.jobbed.showError(
                  "You should not receive a related register on a not editable mode.",
                  "{qia_admister}(ErrCode-000014)"
                );
                return;
              }
              if (!this._enableJoins) {
                return;
              }
              for (let i = 0; i < allLinkedFields.length; i++) {
                let linkedValue = res[allLinkedWith[i]];
                allLinkedFields[i].value = linkedValue;
              }
              this.qinpel.jobbed.show();
            });
          };
          let buttonRelater = new QinButton({ icon: new QinIcon(QinAsset.FaceSearchLink) });
          buttonRelater.addActionMain(actionRelater);
          let lastField = allLinkedFields[allLinkedFields.length - 1];
          lastField.rows.putOn(1, buttonRelater);
          lastField.edit.addActionKey(["f4"], actionRelater);
        }
      }
    });
  }

  private updateJoined(joined: AdJoined) {
    if (!this.regModeEditable) {
      return;
    }
    let source = joined.alias ?? joined.module.registry?.alias ?? joined.module.registry?.name;
    let toUpdate: AdField[] = [];
    for (let field of this._model.fields) {
      if (field.fieldSource === source) {
        toUpdate.push(field);
      }
    }
    if (toUpdate.length == 0) return;
    let registry = {
      name: "",
    };
    if (joined.registry) {
      Object.assign(registry, joined.registry);
    } else {
      Object.assign(registry, joined.module.registry);
    }
    if (joined.alias) {
      registry["alias"] = joined.alias;
    }
    let registier: AdRegistier = {
      base: this.based.registier.base,
      registry,
    };
    let fields: AdTyped[] = [];
    for (let field of toUpdate) {
      fields.push(field.typed);
    }
    let filters: AdFilter[] = [];
    if (joined.filters) {
      for (let filter of joined.filters) {
        if (filter.linked) {
          let fromField = this._model.getFieldByName(filter.linked.name);
          let thisFilter = {
            seems: AdFilterSeems.SAME,
            likes: AdFilterLikes.EQUALS,
            valued: {
              name: filter.linked.with,
              type: fromField.typed.type,
              data: fromField.valued.data,
            },
            ties: AdFilterTies.AND,
          };
          filters.push(thisFilter);
        } else {
          filters.push(filter);
        }
      }
    }
    let select: AdSelect = { registier, fields, joins: null, filters, orders: null, limit: 1 };
    this.qinpel.talk
      .post("/reg/ask", select)
      .then((res) => {
        let rows = this.qinpel.our.soul.body.getCSVRows(res.data);
        if (rows.length > 0) {
          let row = rows[0];
          for (let i = 0; i < toUpdate.length; i++) {
            toUpdate[i].value = row[i];
          }
        } else {
          for (let i = 0; i < toUpdate.length; i++) {
            toUpdate[i].value = null;
          }
        }
      })
      .catch((err) => {
        this.displayError(err, "{qia_admister}(ErrCode-000013)");
      });
  }

  private applyPermissions() {
    this.qinpel.talk
      .post("/reg/can", this.registier)
      .then((res) => {
        let permissions: AdRegPermissions = res.data;
        if (!permissions.all) {
          if (!permissions.insert) {
            this.restrictInsert();
          }
          if (!permissions.select) {
            this.restrictSelect();
          }
          if (!permissions.update) {
            this.restrictUpdate();
          }
          if (!permissions.delete) {
            this.restrictDelete();
          }
        }
        this.finish();
      })
      .catch((err) => this.qinpel.jobbed.showError(err, "{qia_admister}(ErrCode-000016)"));
  }

  private finish() {
    if (
      this._expect.scopes.find((scope) => scope === AdScope.ALL || scope === AdScope.INSERT)
    ) {
      this.turnMode(AdRegMode.INSERT);
      this._model.clean();
    } else {
      this.turnMode(AdRegMode.SEARCH);
    }
    this._bar.finish();
    this.reVisible();
  }

  public restrictInsert() {
    this._expect.restrictInsert();
  }

  public restrictSelect() {
    this._expect.restrictSelect();
  }

  public restrictUpdate() {
    this._expect.restrictUpdate();
  }

  public restrictDelete() {
    this._expect.restrictDelete();
  }

  public hasScope(scope: AdScope): boolean {
    return this._expect.hasScope(scope);
  }

  public isRegModeInsert(): boolean {
    return this.regMode == AdRegMode.INSERT;
  }

  public isRegModeMutate(): boolean {
    return this.regMode == AdRegMode.MUTATE;
  }

  public isRegModeNotice(): boolean {
    return this.regMode == AdRegMode.NOTICE;
  }

  public isRegModeSearch(): boolean {
    return this.regMode == AdRegMode.SEARCH;
  }

  public hasSelectedNoticed(): boolean {
    return this.isRowSelectedValid() && this.isRegModeNotice();
  }

  public getSelectValueOf(fieldName: string) {
    let index = this._model.getFieldIndexByName(fieldName);
    return this._selectedValues[index];
  }

  public tryTurnInsert(): Promise<AdRegTurningInsert> {
    return new Promise<AdRegTurningInsert>((resolve, reject) => {
      this.tryTurnMode(AdRegMode.INSERT)
        .then(() => {
          this._model.clean();
          resolve({} as AdRegTurningInsert);
        })
        .catch((err) => reject(err));
    });
  }

  public tryTurnSearch(): Promise<AdRegTurningSearch> {
    return new Promise<AdRegTurningSearch>((resolve, reject) => {
      this.tryTurnMode(AdRegMode.SEARCH)
        .then(() => {
          resolve({} as AdRegTurningInsert);
        })
        .catch((err) => reject(err));
    });
  }

  public tryTurnNotice(): Promise<AdRegTurningNotice> {
    return new Promise<AdRegTurningNotice>((resolve, reject) => {
      if (!this.isRowSelectedValid()) {
        reject({ why: "There's no valid row selected to notice." });
        return;
      }
      this.tryTurnMode(AdRegMode.NOTICE)
        .then(() => {
          let turningNotice = {
            oldRow: this._selectedRow,
            newRow: this._selectedRow,
          } as AdRegTurningNotice;
          let canceledNotice = this.callTryListeners(AdRegTurn.TURN_NOTICE, turningNotice);
          if (canceledNotice) {
            reject(canceledNotice);
          }
          this.selectRowAndValues(this._selectedRow, this._selectedValues);
          this.callDidListeners(AdRegTurn.TURN_NOTICE, turningNotice);
          resolve(turningNotice);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public tryTurnNoticeRow(row: number, values: string[]): Promise<AdRegTurningNotice> {
    return new Promise<AdRegTurningNotice>((resolve, reject) => {
      if (this._expect.scopes.find((scope) => scope === AdScope.RELATE)) {
        let selected = {};
        for (let i = 0; i < this._model.fields.length; i++) {
          selected[this._model.fields[i].name] = values[i];
        }
        this.qinpel.jobbed.sendWaiters(selected);
        this.qinpel.jobbed.close();
        return;
      }
      this.tryTurnMode(AdRegMode.NOTICE)
        .then(() => {
          let turningNotice = {
            oldRow: this._selectedRow,
            newRow: row,
          } as AdRegTurningNotice;
          let canceledNotice = this.callTryListeners(AdRegTurn.TURN_NOTICE, turningNotice);
          if (canceledNotice) {
            reject(canceledNotice);
          }
          this.selectRowAndValues(row, values);
          this.callDidListeners(AdRegTurn.TURN_NOTICE, turningNotice);
          resolve(turningNotice);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public tryTurnMutate(): Promise<AdRegTurningMutate> {
    return new Promise<AdRegTurningMutate>((resolve, reject) => {
      if (!this.isRowSelectedValid()) {
        reject({ why: "There's no valid row selected to mutate." });
        return;
      }
      this.tryTurnMode(AdRegMode.MUTATE)
        .then(() => {})
        .catch((err) => reject(err));
    });
  }

  private tryTurnMode(mode: AdRegMode): Promise<AdRegTurningMode> {
    return new Promise<AdRegTurningMode>((resolve, reject) => {
      this.checkForMutations()
        .then(() => {
          let turning = {
            oldMode: this._regMode,
            newMode: mode,
          } as AdRegTurningMode;
          let canceled = this.callTryListeners(AdRegTurn.TURN_MODE, turning);
          if (canceled) {
            reject(canceled);
          }
          this.turnMode(mode);
          this.callDidListeners(AdRegTurn.TURN_MODE, turning);
          resolve(turning);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private hasRowSelected(): boolean {
    return this._selectedRow > -1;
  }

  private isRowSelectedValid(): boolean {
    return this._selectedRow >= 0 && this._selectedRow < this._table.getLinesSize();
  }

  private selectRowAndValues(row: number, values: string[]) {
    for (let i = 0; i < values.length; i++) {
      this._model.setValue(i, values[i]);
    }
    this._selectedRow = row;
    this._selectedValues = values;
    this._table.select(row);
    this._table.scrollTo(row);
  }

  private turnMode(mode: AdRegMode) {
    if (mode === AdRegMode.SEARCH) {
      this._body.show(this._search);
    } else {
      this._body.show(this._editor);
    }
    if (mode === AdRegMode.NOTICE) {
      this._model.turnReadOnly();
    } else {
      this._model.turnEditable();
    }
    this._regMode = mode;
  }

  public unselectAll(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.checkForMutations()
        .then(() => {
          this._selectedRow = -1;
          this._table.unselectAll();
          this._model.clean();
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public tryRefresh(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this._regMode == AdRegMode.NOTICE) {
        this._loader
          .refresh()
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else {
        reject({ why: "There's no selected register to refresh." });
      }
    });
  }

  public refreshSelected(row: any[]) {
    if (this._regMode == AdRegMode.NOTICE) {
      const fields = this._model.fields;
      this._selectedValues = Array(row.length);
      for (let i = 0; i < row.length; i++) {
        fields[i].value = row[i];
        this._selectedValues[i] = row[i];
      }
      this.table.setLine(this._selectedRow, this._selectedValues);
    }
  }

  public tryGoFirst(): Promise<AdRegTurningNotice> {
    return new Promise<AdRegTurningNotice>((resolve, reject) => {
      if (this._table.getLinesSize() > 0) {
        let values = this._table.getLine(0);
        this.tryTurnNoticeRow(0, values)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else {
        reject({ why: "Can not move the selected row" });
      }
    });
  }

  public tryGoPrior(): Promise<AdRegTurningNotice> {
    return new Promise<AdRegTurningNotice>((resolve, reject) => {
      let size = this._table.getLinesSize();
      let attempt = this._selectedRow - 1;
      if (attempt >= 0 && attempt < size) {
        let values = this._table.getLine(attempt);
        this.tryTurnNoticeRow(attempt, values)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else {
        reject({ why: "Can not move the selected row" });
      }
    });
  }

  public tryGoNext(): Promise<AdRegTurningNotice> {
    return new Promise<AdRegTurningNotice>((resolve, reject) => {
      let size = this._table.getLinesSize();
      let attempt = this._selectedRow + 1;
      if (attempt < size) {
        let values = this._table.getLine(attempt);
        this.tryTurnNoticeRow(attempt, values)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else {
        reject({ why: "Can not move the selected row" });
      }
    });
  }

  public tryGoLast(): Promise<AdRegTurningNotice> {
    return new Promise<AdRegTurningNotice>((resolve, reject) => {
      let size = this._table.getLinesSize();
      if (size > 0) {
        let values = this._table.getLine(size - 1);
        this.tryTurnNoticeRow(size - 1, values)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      } else {
        reject({ why: "Can not move the selected row" });
      }
    });
  }

  public tryConfirm(): Promise<any> {
    if (this.regMode === AdRegMode.INSERT) {
      return this.tryInsert();
    } else if (this.regMode === AdRegMode.MUTATE) {
      return this.tryUpdate();
    } else if (this.regMode === AdRegMode.SEARCH) {
      return this.trySelect();
    } else {
      return Promise.resolve();
    }
  }

  private trySelect(): Promise<void> {
    return this.loader.load();
  }

  private tryInsert(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._enableJoins = false;
      this.model
        .insert()
        .then((regKeys) => {
          let query = this.loader.mountSelect(false, regKeys);
          AdRegCalls.selectRow(query)
            .then((res) => {
              this.focusFirstField();
              this._model.setValues(res);
              const size = this._table.getLinesSize();
              this._table.addLine(res);
              if (this.hasScope(AdScope.NOTICE)) {
                this.tryTurnNoticeRow(size, res)
                  .then((_) => resolve())
                  .catch((err) => reject(err));
              } else {
                this._model.clean();
                resolve();
              }
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err))
        .finally(() => (this._enableJoins = true));
    });
  }

  private tryUpdate(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.model
        .update()
        .then((res) => {
          this.focusFirstField();
          this.displayInfo(AdApprise.UPDATED_REGISTER, "{qia_admister}(ErrCode-000010)");
          let values = res.map((valued) => valued.data);
          this._table.setLine(this._selectedRow, values);
          this.tryTurnMode(AdRegMode.NOTICE);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public tryCancel(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.regMode === AdRegMode.INSERT) {
        this.checkForMutations()
          .then((_) => {
            this._model.clean();
            resolve();
          })
          .catch((err) => reject(err));
      } else if (this.regMode === AdRegMode.MUTATE) {
        this.tryTurnMode(AdRegMode.NOTICE)
          .then((_) => resolve())
          .catch((err) => reject(err));
      } else if (this.regMode === AdRegMode.SEARCH) {
        this._search.clean();
        resolve();
      }
    });
  }

  public tryDelete(): Promise<AdRegTurningDelete> {
    return new Promise<AdRegTurningDelete>((resolve, reject) => {
      if (!this.hasRowSelected()) {
        reject({ why: "No selected row to delete" });
        return;
      }
      this.qinpel.jobbed
        .showDialog("Do you really want to delete?")
        .then((want) => {
          if (want) {
            let turning: AdRegTurningDelete = {
              seeRow: this._selectedRow,
            };
            let canceled = this.callTryListeners(AdRegTurn.TURN_DELETE, turning);
            if (canceled) {
              reject(canceled);
            }
            this._model
              .delete()
              .then(() => {
                this._table.delLine(this._selectedRow);
                this.callDidListeners(AdRegTurn.TURN_DELETE, turning);
                this.tryTurnMode(AdRegMode.INSERT);
                resolve(turning);
              })
              .catch((err) => reject(err));
          }
        })
        .catch((err) => reject(err));
    });
  }

  private checkForMutations(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.hasScope(AdScope.INSERT) && !this.hasScope(AdScope.MUTATE)) {
        resolve();
        return;
      }
      const mutations = this._model.hasMutations();
      if (mutations) {
        let message =
          "There are mutations on:\n" + mutations.join(", ") + "\nShould we continue?";
        this.qinpel.jobbed.showDialog(message).then((confirmed) => {
          if (confirmed) {
            resolve();
          } else {
            reject(AdApprise.CANCELED_BY_MUTATIONS);
          }
        });
      } else {
        resolve();
      }
    });
  }

  public displayInfo(info: any, origin: string) {
    if (info instanceof AdApprised) {
      if (info.popup) {
        this.qinpel.jobbed.showInfo(info, origin);
      }
    }
    this.qinpel.jobbed.statusInfo(info, origin);
  }

  public displayError(error: any, origin: string) {
    if (error instanceof AdApprised) {
      if (error.popup) {
        this.qinpel.jobbed.showError(error, origin);
      }
    } else {
      this.qinpel.jobbed.showError(error, origin);
    }
    this.qinpel.jobbed.statusError(error, origin);
  }

  public viewSingle() {
    this._viewVertical.unInstall();
    this._viewHorizontal.unInstall();
    this._viewSingle.install(this);
    this._body.install(this._viewSingle);
    this._table.install(this._viewSingle);
    if (this._regMode === AdRegMode.SEARCH) {
      this._viewSingle.show(this._table);
    } else {
      this._viewSingle.show(this._body);
    }
    this._regView = AdRegView.SINGLE;
    this.callDidListeners(AdRegTurn.TURN_VIEW, { newValue: this._regView });
    this.qinpel.chief.saveConfig(
      this._identifier + "-" + AdRegParams.VIEW_SELECTED,
      AdRegParams.VIEW_SELECTED_SINGLE
    );
  }

  public viewVertical() {
    this._viewSingle.unInstall();
    this._viewHorizontal.unInstall();
    this._viewVertical.install(this);
    this._body.install(this._viewVertical);
    this._table.install(this._viewVertical);
    this._body.reDisplay();
    this._table.reDisplay();
    this._regView = AdRegView.VERTICAL;
    this.callDidListeners(AdRegTurn.TURN_VIEW, { newValue: this._regView });
    this.qinpel.chief.saveConfig(
      this._identifier + "-" + AdRegParams.VIEW_SELECTED,
      AdRegParams.VIEW_SELECTED_VERTICAL
    );
  }

  public viewHorizontal() {
    this._viewSingle.unInstall();
    this._viewVertical.unInstall();
    this._viewHorizontal.install(this);
    this._body.install(this._viewHorizontal);
    this._table.install(this._viewHorizontal);
    this._body.reDisplay();
    this._table.reDisplay();
    this._regView = AdRegView.HORIZONTAL;
    this.callDidListeners(AdRegTurn.TURN_VIEW, { newValue: this._regView });
    this.qinpel.chief.saveConfig(
      this._identifier + "-" + AdRegParams.VIEW_SELECTED,
      AdRegParams.VIEW_SELECTED_HORIZONTAL
    );
  }

  public addListener(listener: AdRegListener) {
    this._listener.push(listener);
  }

  public delListener(listener: AdRegListener) {
    var index = this._listener.indexOf(listener);
    if (index >= 0) {
      this._listener.splice(index, 1);
    }
  }

  private callTryListeners(event: AdRegTurn, valued: any): AdRegTryCanceled {
    this._listener.forEach((listen) => {
      if (listen.event === event) {
        if (listen.onTry) {
          let cancel = listen.onTry(valued);
          if (cancel) {
            return cancel;
          }
        }
      }
    });
    return null;
  }

  private callDidListeners(event: AdRegTurn, mutation: any) {
    this._listener.forEach((listen) => {
      if (listen.event === event) {
        if (listen.onDid) {
          listen.onDid(mutation);
        }
      }
    });
  }

  public focusFirstField() {
    if (this.model.fields.length > 0) {
      this.model.fields[0].focus();
    }
  }

  public focusBody() {
    if (this._regView == AdRegView.SINGLE) {
      this._viewSingle.show(this._body);
    }
    this._body.focus();
  }

  public focusTable() {
    if (this._regView == AdRegView.SINGLE) {
      this._viewSingle.show(this._table);
    }
    this._table.focus();
  }
}

export type AdRegPermissions = {
  all: boolean;
  insert: boolean;
  select: boolean;
  update: boolean;
  delete: boolean;
};

export enum AdRegMode {
  INSERT = "INSERT",
  SEARCH = "SEARCH",
  MUTATE = "MUTATE",
  NOTICE = "NOTICE",
}

export enum AdRegView {
  SINGLE = "SINGLE",
  VERTICAL = "VERTICAL",
  HORIZONTAL = "HORIZONTAL",
}

export enum AdRegTurn {
  TURN_VIEW = "TURN_VIEW",
  TURN_MODE = "TURN_MODE",
  TURN_INSERT = "TURN_INSERT",
  TURN_NOTICE = "TURN_NOTICE",
  TURN_MUTATE = "TURN_MUTATE",
  TURN_DELETE = "TURN_DELETE",
}

export type AdRegTurningView = {
  oldView: AdRegView;
  newView: AdRegView;
};

export type AdRegTurningMode = {
  oldMode: AdRegMode;
  newMode: AdRegMode;
};

export type AdRegTurningInsert = {};

export type AdRegTurningSearch = {};

export type AdRegTurningNotice = {
  oldRow: number;
  newRow: number;
};

export type AdRegTurningMutate = {
  seeRow: number;
};

export type AdRegTurningDelete = {
  seeRow: number;
};

export type AdRegTurning =
  | AdRegTurningView
  | AdRegTurningMode
  | AdRegTurningInsert
  | AdRegTurningSearch
  | AdRegTurningNotice
  | AdRegTurningMutate
  | AdRegTurningDelete;

export type AdRegTryCanceled = AdApprised;

export type AdRegTryCaller = (turning: AdRegTurning) => AdRegTryCanceled;
export type AdRegDidCaller = (turning: AdRegTurning) => void;

export type AdRegListener = {
  event: AdRegTurn;
  onTry?: AdRegTryCaller;
  onDid?: AdRegDidCaller;
};

export enum AdRegParams {
  VIEW_SELECTED = "VIEW_SELECTED",
  VIEW_SELECTED_SINGLE = "VIEW_SELECTED_SINGLE",
  VIEW_SELECTED_VERTICAL = "VIEW_SELECTED_VERTICAL",
  VIEW_SELECTED_HORIZONTAL = "VIEW_SELECTED_HORIZONTAL",
  VIEW_VERTICAL_SIDE_A = "VIEW_VERTICAL_SIDE_A",
  VIEW_VERTICAL_SIDE_B = "VIEW_VERTICAL_SIDE_B",
  VIEW_HORIZONTAL_SIDE_A = "VIEW_HORIZONTAL_SIDE_A",
  VIEW_HORIZONTAL_SIDE_B = "VIEW_HORIZONTAL_SIDE_B",
}

export type AdRegDetail = {
  setup: AdSetup;
  title?: string;
};
