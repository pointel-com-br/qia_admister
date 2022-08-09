import {
  QinAsset,
  QinButton,
  QinColumn,
  QinIcon,
  QinLabel,
  QinSplitter,
  QinStack,
} from "qin_case";
import { AdApprise, AdApprised } from "./ad-apprise";
import { AdExpect } from "./ad-expect";
import { AdField } from "./ad-field";
import { AdFilter, AdFilterLikes, AdFilterSeems, AdFilterTies } from "./ad-filter";
import { AdJoined } from "./ad-joined";
import { AdRegBar } from "./ad-reg-bar";
import { AdRegBase } from "./ad-reg-base";
import { AdRegEditor } from "./ad-reg-editor";
import { AdRegLoader } from "./ad-reg-loader";
import { AdRegModel } from "./ad-reg-model";
import { AdRegSearch } from "./ad-reg-search";
import { AdRegTable } from "./ad-reg-table";
import { AdRegistry } from "./ad-registry";
import { AdSelect } from "./ad-select";
import { AdModule, AdScope, AdSetup, AdTools } from "./ad-tools";
import { AdTyped } from "./ad-typed";

export class AdRegister extends QinColumn {
  private _module: AdModule;
  private _expect: AdExpect;
  private _base: AdRegBase;
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
  private _listener = new Array<AdRegListener>();

  public constructor(module: AdModule, expect: AdExpect, base: AdRegBase) {
    super();
    this.unVisible();
    this._module = module;
    this._expect = expect;
    this._base = base;
    this._identifier =
      module.appName +
      "," +
      module.title +
      "," +
      base.registry.base +
      "," +
      base.registry.catalog +
      "," +
      base.registry.schema +
      "," +
      base.registry.name +
      "," +
      base.registry.alias;
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
    this._viewSingle.style.putAsFlexMax();
    this._viewVertical.style.putAsFlexMax();
    this._viewHorizontal.style.putAsFlexMax();
    this._bar.install(this);
    this._body.stack(this._editor);
    this._body.stack(this._search);
    this._body.style.putAsFlexMax();
    this._editor.style.putAsFlexMax();
    this._search.style.putAsFlexMax();
    this._table.style.putAsFlexMax();
    this._bar.tabIndex = 0;
    this._body.tabIndex = 1;
    this._table.tabIndex = 2;
  }

  public get module(): AdModule {
    return this._module;
  }

  public get base(): AdRegBase {
    return this._base;
  }

  public get registry(): AdRegistry {
    return this._base.registry;
  }

  public get expect(): AdExpect {
    return this._expect;
  }

  public get model(): AdRegModel {
    return this._model;
  }

  public get identifier() {
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

  public addTab(title: string) {
    this._editor.addTab(title);
  }

  public addLine() {
    this._editor.addLine();
  }

  public addField(field: AdField) {
    this._model.addField(field);
    this._editor.addField(field);
    this._search.addField(field);
    this._table.addHead(field.title);
  }

  public addDetail(setup: AdSetup) {
    const title = setup.module.title;
    let button = new QinButton({ label: new QinLabel(title) });
    button.addActionMain((_) => {
      if (!this.hasRowSelected()) {
        this.qinpel.jobbed.showError(
          "You must select a row before show the details of " + title,
          "{qia_admister}(ErrCode-000015)"
        );
        return;
      }
      let detailFilters: AdFilter[] = [];
      if (setup.filters) {
        for (let filter of setup.filters) {
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
          } else {
            detailFilters.push(filter);
          }
        }
      }
      this.qinpel.chief.newJobber(
        setup.module.title,
        setup.module.appName,
        AdTools.newAdSetupOption(setup.module, setup.scopes, detailFilters)
      );
    });
    this._editor.addAct(button);
  }

  public prepare() {
    if (this._base.joins) {
      this.initJoins();
    }
    this.applyPermissions();
  }

  private initJoins() {
    this._base.joins.forEach((join) => {
      if (join.filters) {
        let allLinkedFields = new Array<AdField>();
        let allLinkedWith = new Array<string>();
        join.filters.forEach((filter) => {
          if (filter.linked) {
            let linkedField = this._model.getFieldByName(filter.linked.name);
            linkedField.addOnChanged((_) => {
              this.updateJoined(join);
            });
            allLinkedFields.push(linkedField);
            allLinkedWith.push(filter.linked.with);
          }
        });
        if (allLinkedFields.length > 0) {
          let callRelater = new QinButton({ icon: new QinIcon(QinAsset.FaceSearchLink) });
          allLinkedFields[allLinkedFields.length - 1].rows.putOn(1, callRelater);
          callRelater.addActionMain((_) => {
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
              for (let i = 0; i < allLinkedFields.length; i++) {
                let linkedValue = res[allLinkedWith[i]];
                allLinkedFields[i].value = linkedValue;
              }
            });
          });
        }
      }
    });
  }

  private updateJoined(joined: AdJoined) {
    if (!this.regModeEditable) {
      return;
    }
    let source = joined.alias ?? joined.registry.alias ?? joined.registry.name;
    let toUpdate: AdField[] = [];
    for (let field of this._model.fields) {
      if (field.source === source) {
        toUpdate.push(field);
      }
    }
    if (toUpdate.length == 0) return;
    let registry = joined.alias ? { ...joined.registry, alias: joined.alias } : joined.registry;
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
    let select: AdSelect = { registry, fields, joins: null, filters, orders: null, limit: 1 };
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
      .post("/reg/can", this._base.registry)
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
    this._bar.finish();
    if (
      this._expect.scopes.find((scope) => scope === AdScope.ALL || scope === AdScope.INSERT)
    ) {
      this.tryTurnMode(AdRegMode.INSERT);
      this._model.clean();
    } else {
      this.tryTurnMode(AdRegMode.SEARCH);
    }
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

  public tryGoFirst() {
    if (this._table.getLinesSize() > 0) {
      let values = this._table.getLine(0);
      this.tryTurnNoticeRow(0, values);
    }
  }

  public tryGoPrior() {
    let size = this._table.getLinesSize();
    let attempt = this._selectedRow - 1;
    if (attempt >= 0 && attempt < size) {
      let values = this._table.getLine(attempt);
      this.tryTurnNoticeRow(attempt, values);
    }
  }

  public tryGoNext() {
    let size = this._table.getLinesSize();
    let attempt = this._selectedRow + 1;
    if (attempt < size) {
      let values = this._table.getLine(attempt);
      this.tryTurnNoticeRow(attempt, values);
    }
  }

  public tryGoLast() {
    let size = this._table.getLinesSize();
    if (size > 0) {
      let values = this._table.getLine(size - 1);
      this.tryTurnNoticeRow(size - 1, values);
    }
  }

  public tryConfirm(): Promise<void> {
    if (this.regMode === AdRegMode.SEARCH) {
      return this.trySelect();
    } else if (this.regMode === AdRegMode.INSERT) {
      return this.tryInsert();
    } else if (this.regMode === AdRegMode.MUTATE) {
      return this.tryUpdate();
    }
  }

  private trySelect(): Promise<void> {
    return this.loader.load();
  }

  private tryInsert(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.model
        .insert()
        .then((res) => {
          this._model.clean();
          this.focusFirstField();
          this.displayInfo(AdApprise.INSERTED_REGISTER, "{qia_admister}(ErrCode-000009)");
          let values = res.map((valued) => valued.data);
          this._table.addLine(values);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
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

  public tryCancel() {
    if (this.regMode === AdRegMode.INSERT) {
      this.checkForMutations().then((_) => this._model.clean());
    } else if (this.regMode === AdRegMode.SEARCH) {
      this._search.clean();
    } else if (this.regMode === AdRegMode.MUTATE) {
      this.tryTurnMode(AdRegMode.NOTICE);
    }
  }

  public tryDelete(): Promise<AdRegTurningDelete> {
    return new Promise<AdRegTurningDelete>((resolve, reject) => {
      this.checkForMutations()
        .then(() => {
          if (!this.hasRowSelected()) {
            reject({ why: "No selected row to delete" });
            return;
          }
          this.qinpel.jobbed
            .showDialog("Do you really want to delete?")
            .then((want) => {
              if (want) {
                let turning = {
                  seeRow: this._selectedRow,
                } as AdRegTurningDelete;
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
                  .catch((err) => {
                    reject(err);
                  });
              }
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private checkForMutations(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
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
  VIEW_VERTICAL_SIDE_A = "VIEW_VERTICAL_SIDE_A",
  VIEW_VERTICAL_SIDE_B = "VIEW_VERTICAL_SIDE_B",
  VIEW_HORIZONTAL_SIDE_A = "VIEW_HORIZONTAL_SIDE_A",
  VIEW_HORIZONTAL_SIDE_B = "VIEW_HORIZONTAL_SIDE_B",
}
