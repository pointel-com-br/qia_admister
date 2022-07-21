import { AdLinked } from "./ad-linked";
import { AdValued } from "./ad-valued";

export class AdFilter {
  public seems: AdFilterSeems;
  public likes: AdFilterLikes;
  public valued: AdValued;
  public linked: AdLinked;
  public ties: AdFilterTies;

  constructor(options?: AdFilterSet) {
    this.seems = options?.seems ?? AdFilterSeems.SAME;
    this.likes = options?.likes ?? AdFilterLikes.EQUALS;
    this.valued = options?.valued;
    this.linked = options?.linked;
    this.ties = options?.ties ?? AdFilterTies.AND;
  }
}

export type AdFilterSet = {
  seems?: AdFilterSeems;
  likes?: AdFilterLikes;
  valued?: AdValued;
  linked?: AdLinked;
  ties?: AdFilterTies;
};

export enum AdFilterSeems {
  SAME = "SAME",
  DIVERSE = "DIVERSE",
}

export enum AdFilterLikes {
  EQUALS = "EQUALS",
  BIGGER = "BIGGER",
  LESSER = "LESSER",
  BIGGER_EQUALS = "BIGGER_EQUALS",
  LESSER_EQUALS = "LESSER_EQUALS",
  STARTS_WITH = "STARTS_WITH",
  ENDS_WITH = "ENDS_WITH",
  CONTAINS = "CONTAINS",
}

export enum AdFilterTies {
  AND = "AND",
  OR = "OR",
}
