import { QinPanel } from "qinpel-cps";
import { AdNames } from "./ad-names";

class AdMister extends QinPanel {
  public constructor() {
    super();
    const qinDesk = this.qinpel.chief.newDesk(this.qinpel, {
      addsApps: (manifest) => manifest.group == AdNames.AdMister,
      addsCfgs: (manifest) =>
        [this.qinpel.our.names.QinBases as string].indexOf(manifest.title) > -1,
    });
    this.castedQine().appendChild(qinDesk.getMain());
  }
}

new AdMister().style.putAsBody();
