import { QinPanel } from "qin_case";
import { AdNames } from "./ad-names";

class AdMister extends QinPanel {
    public constructor() {
        super();
        const qinDesk = this.qinpel.chief.newDesk(this.qinpel, {
            addsApps: (manifest) => manifest.group == AdNames.AdMister,
            addsCfgs: (manifest) => manifest.title == this.qinpel.our.names.QinBases,
        });
        this.castedQine().appendChild(qinDesk.getMain());
    }
}

new AdMister().putAsBody();
