import {
  QinAsset,
  QinButton,
  QinDivider,
  QinIcon,
  QinIconPick,
  QinLine,
  QinPopup,
} from "qin_case";
import { AdApprise } from "./ad-apprise";
import { AdRegister, AdRegMode, AdRegTurn, AdRegTurningMode } from "./ad-register";
import { AdScope } from "./ad-tools";

export class AdRegBar extends QinLine {
  private _reg: AdRegister;

  private _qinMenu = new QinButton({
    icon: new QinIcon(QinAsset.FaceMenuLines),
  });
  private _qinMenuViewSingle = new QinButton({
    icon: new QinIcon(QinAsset.FaceSplitNotView),
  });
  private _qinMenuViewVertical = new QinButton({
    icon: new QinIcon(QinAsset.FaceSplitViewVertical),
  });
  private _qinMenuViewHorizontal = new QinButton({
    icon: new QinIcon(QinAsset.FaceSplitViewHorizontal),
  });
  private _qinMenuFocusBody = new QinButton({
    icon: new QinIcon(QinAsset.FaceListView),
  });
  private _qinMenuFocusTable = new QinButton({
    icon: new QinIcon(QinAsset.FaceGridView),
  });
  private _qinMenuBody = new QinLine({
    items: [
      this._qinMenuViewSingle,
      this._qinMenuViewVertical,
      this._qinMenuViewHorizontal,
      new QinDivider(),
      this._qinMenuFocusBody,
      this._qinMenuFocusTable,
    ],
  });
  private _qinPopup = new QinPopup(this._qinMenuBody);

  private _qinInsert = new QinIcon(QinAsset.FaceAdd);
  private _qinSearch = new QinIcon(QinAsset.FaceSearch);
  private _qinNotice = new QinIcon(QinAsset.FaceEye);

  private _qinMode = new QinIconPick({ readOnly: true });

  private _qinGoFirst = new QinButton({
    icon: new QinIcon(QinAsset.FaceRUpChevronPush),
  });
  private _qinGoPrior = new QinButton({
    icon: new QinIcon(QinAsset.FaceRLeftChevronPush),
  });
  private _qinGoNext = new QinButton({
    icon: new QinIcon(QinAsset.FaceRRightChevronPush),
  });
  private _qinGoLast = new QinButton({
    icon: new QinIcon(QinAsset.FaceRDownChevronPush),
  });

  private _qinMutate = new QinButton({
    icon: new QinIcon(QinAsset.FacePencil),
  });
  private _qinConfirm = new QinButton({
    icon: new QinIcon(QinAsset.FaceConfirm),
  });
  private _qinCancel = new QinButton({
    icon: new QinIcon(QinAsset.FaceCancel),
  });
  private _qinDelete = new QinButton({
    icon: new QinIcon(QinAsset.FaceTrash),
  });

  public constructor(register: AdRegister) {
    super();
    this._reg = register;
    this.initMenu();
    this.initMode();
    this.initMove();
    this.initMake();
    this.style.putAsPaddingBottom(2);
    this.style.putAsBorderBottom(2, "#999");
    this.style.putAsMarginBottom(2);
  }

  private initMenu() {
    this._qinMenu.install(this);
    this._qinMenu.style.putAsPadding(7);
    this._qinMenu.addActionMain((_) => this._qinPopup.showOnParent(this._qinMenu));
    this._qinMenuViewSingle.addActionMain((_) => {
      this._qinPopup.close();
      this._reg.viewSingle();
    });
    this._qinMenuViewVertical.addActionMain((_) => {
      this._qinPopup.close();
      this._reg.viewVertical();
    });
    this._qinMenuViewHorizontal.addActionMain((_) => {
      this._qinPopup.close();
      this._reg.viewHorizontal();
    });
    this._qinMenuFocusBody.addActionMain((_) => {
      this._qinPopup.close();
      this._reg.focusBody();
    });
    this._qinMenuFocusTable.addActionMain((_) => {
      this._qinPopup.close();
      this._reg.focusTable();
    });
  }

  private initMode() {
    this._qinMode.install(this);
    this._qinInsert.addActionMain((_) =>
      this._reg.tryTurnInsert().catch((err) => {
        this._reg.displayError(err, "{qia_admister}(ErrCode-000003)");
      })
    );
    this._qinSearch.addActionMain((_) =>
      this._reg.tryTurnSearch().catch((err) => {
        this._reg.displayError(err, "{qia_admister}(ErrCode-000004)");
      })
    );
    this._qinNotice.addActionMain((_) =>
      this._reg.tryTurnNotice().catch((err) => {
        this._reg.displayError(err, "{qia_admister}(ErrCode-000005)");
      })
    );
    this._reg.addListener({
      event: AdRegTurn.TURN_MODE,
      onDid: (turned) => this.setMode((turned as AdRegTurningMode).newMode),
    });
  }

  private initMove() {
    this._qinGoFirst.install(this);
    this._qinGoFirst.style.putAsPadding(7);
    this._qinGoFirst.addActionMain((_) => this._reg.tryGoFirst());
    this._qinGoPrior.install(this);
    this._qinGoPrior.style.putAsPadding(7);
    this._qinGoPrior.addActionMain((_) => this._reg.tryGoPrior());
    this._qinGoNext.install(this);
    this._qinGoNext.style.putAsPadding(7);
    this._qinGoNext.addActionMain((_) => this._reg.tryGoNext());
    this._qinGoLast.install(this);
    this._qinGoLast.style.putAsPadding(7);
    this._qinGoLast.addActionMain((_) => this._reg.tryGoLast());
  }

  private initMake() {
    this._qinMutate.install(this);
    this._qinMutate.style.putAsPadding(7);
    this._qinMutate.addActionMain((_) =>
      this._reg.tryTurnMutate().catch((err) => {
        this._reg.displayError(err, "{qia_admister}(ErrCode-000012)");
      })
    );
    this._qinConfirm.install(this);
    this._qinConfirm.style.putAsPadding(7);
    this._qinConfirm.addActionMain((_) =>
      this._reg.tryConfirm().catch((err) => {
        this._reg.displayError(err, "{qia_admister}(ErrCode-000007)");
      })
    );
    this._qinCancel.install(this);
    this._qinCancel.style.putAsPadding(7);
    this._qinCancel.addActionMain((_) => this._reg.tryCancel());
    this._qinDelete.install(this);
    this._qinDelete.style.putAsPadding(7);
    this._qinDelete.addActionMain((_) =>
      this._reg
        .tryDelete()
        .then((_) => {
          this.qinpel.jobbed.showInfo(
            AdApprise.DELETED_REGISTER,
            "{qia_admister}(ErrCode-000011)"
          );
        })
        .catch((err) => {
          this._reg.displayError(err, "{qia_admister}(ErrCode-000006)");
        })
    );
  }

  private setMode(mode: AdRegMode) {
    this._qinMode.value = null;
    if (mode) {
      switch (mode) {
        case AdRegMode.INSERT:
          this._qinMode.value = this._qinInsert.asset;
          this._qinGoFirst.unDisplay();
          this._qinGoPrior.unDisplay();
          this._qinGoNext.unDisplay();
          this._qinGoLast.unDisplay();
          this._qinMutate.unDisplay();
          this._qinConfirm.reDisplay();
          this._qinCancel.reDisplay();
          this._qinDelete.unDisplay();
          break;
        case AdRegMode.SEARCH:
          this._qinMode.value = this._qinSearch.asset;
          this._qinGoFirst.unDisplay();
          this._qinGoPrior.unDisplay();
          this._qinGoNext.unDisplay();
          this._qinGoLast.unDisplay();
          this._qinMutate.unDisplay();
          this._qinConfirm.reDisplay();
          this._qinCancel.reDisplay();
          this._qinDelete.unDisplay();
          break;
        case AdRegMode.NOTICE:
          this._qinMode.value = this._qinNotice.asset;
          this._qinGoFirst.reDisplay();
          this._qinGoPrior.reDisplay();
          this._qinGoNext.reDisplay();
          this._qinGoLast.reDisplay();
          if (this._reg.hasScope(AdScope.MUTATE)) {
            this._qinMutate.reDisplay();
          } else {
            this._qinMutate.unDisplay();
          }
          this._qinConfirm.unDisplay();
          this._qinCancel.unDisplay();
          this._qinDelete.unDisplay();
          break;
        case AdRegMode.MUTATE:
          this._qinMode.value = this._qinNotice.asset;
          this._qinGoFirst.unDisplay();
          this._qinGoPrior.unDisplay();
          this._qinGoNext.unDisplay();
          this._qinGoLast.unDisplay();
          this._qinMutate.unDisplay();
          this._qinConfirm.reDisplay();
          this._qinCancel.reDisplay();
          if (this._reg.hasScope(AdScope.DELETE)) {
            this._qinDelete.reDisplay();
          } else {
            this._qinDelete.unDisplay();
          }
          break;
      }
    }
  }

  public finish() {
    let canChangeMode = false;
    if (this._reg.hasScope(AdScope.INSERT)) {
      this._qinMode.addIcon(this._qinInsert);
      canChangeMode = true;
    }
    if (this._reg.hasScope(AdScope.SEARCH)) {
      this._qinMode.addIcon(this._qinSearch);
      canChangeMode = true;
    }
    if (this._reg.hasScope(AdScope.NOTICE)) {
      this._qinMode.addIcon(this._qinNotice);
      canChangeMode = true;
    }
    if (!canChangeMode) {
      this._qinMode.unInstall();
    }
  }
}
