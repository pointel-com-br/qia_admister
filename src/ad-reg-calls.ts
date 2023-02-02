import { QinTool } from "qin_case";
import { AdDelete } from "./ad-delete";
import { AdInsert } from "./ad-insert";
import { AdSelect } from "./ad-select";
import { AdUpdate } from "./ad-update";

export class AdRegCalls {
  public static select(query: AdSelect): Promise<string[][]> {
    return new Promise<string[][]>((resolve, reject) => {
      QinTool.qinpel.talk
        .post("/reg/ask", query)
        .then((res) => resolve(QinTool.qinpel.our.soul.body.getCSVRows(res.data)))
        .catch((err) => reject(err));
    });
  }

  public static insert(query: AdInsert): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      QinTool.qinpel.talk
        .post("/reg/new", query)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  public static update(query: AdUpdate): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      QinTool.qinpel.talk
        .post("/reg/set", query)
        .then((res) => resolve(parseInt(res.data)))
        .catch((err) => reject(err));
    });
  }

  public static delete(query: AdDelete): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      QinTool.qinpel.talk
        .post("/reg/del", query)
        .then((res) => resolve(parseInt(res.data)))
        .catch((err) => reject(err));
    });
  }
}
