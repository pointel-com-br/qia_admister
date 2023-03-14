import { Qine } from "qin_case";
import { AdDelete } from "./ad-delete";
import { AdInsert } from "./ad-insert";
import { AdJoinedTies } from "./ad-joined";
import { AdSelect } from "./ad-select";
import { AdUpdate } from "./ad-update";

export class AdRegCalls {
  public static selectOne(query: AdSelect): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      AdRegCalls.select(query)
        .then(res => {
          if (res && res.length > 0 && res[0] && res[0].length > 0) {
            resolve(res[0][0]);
          } else {
            resolve(null);
          }
        })
        .catch(err => reject(err));
    });
  }

  public static selectRow(query: AdSelect): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      AdRegCalls.select(query)
        .then(res => {
          if (res && res.length > 0) {
            resolve(res[0]);
          } else {
            resolve(null);
          }
        })
        .catch(err => reject(err));
    });
  }

  public static select(query: AdSelect): Promise<string[][]> {
    return new Promise<string[][]>((resolve, reject) => {
      if (query.joins) {
        for (let join of query.joins) {
          if (!join.registry) {
            join.registry = join.module.registry;
          }
          if (!join.ties) {
            join.ties = AdJoinedTies.LEFT;
          }
        }
      }
      Qine.qinpel.talk
        .post("/reg/ask", query)
        .then((res) => resolve(Qine.qinpel.our.soul.body.getCSVRows(res.data)))
        .catch((err) => reject(err));
    });
  }

  public static insert(query: AdInsert): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      Qine.qinpel.talk
        .post("/reg/new", query)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  public static update(query: AdUpdate): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      Qine.qinpel.talk
        .post("/reg/set", query)
        .then((res) => resolve(parseInt(res.data)))
        .catch((err) => reject(err));
    });
  }

  public static delete(query: AdDelete): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      Qine.qinpel.talk
        .post("/reg/del", query)
        .then((res) => resolve(parseInt(res.data)))
        .catch((err) => reject(err));
    });
  }
}
