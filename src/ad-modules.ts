import { QinAsset } from "qin_case";
import { AdModule } from "./ad-tools";

export class AdModules {
  static BUSINESS: AdModule = {
    appName: "adpeople",
    title: "Negócios",
    icon: QinAsset.FaceBusiness,
  };
  static REGION: AdModule = {
    appName: "adpeople",
    title: "Região",
    icon: QinAsset.FaceRegion,
  };
  static NATION: AdModule = {
    appName: "adpeople",
    title: "Países",
    icon: QinAsset.FaceGlobe,
  };
  static STATE: AdModule = {
    appName: "adpeople",
    title: "Estados",
    icon: QinAsset.FaceState,
  };
  static CITY: AdModule = {
    appName: "adpeople",
    title: "Cidades",
    icon: QinAsset.FaceCity,
  };
  static DISTRICT: AdModule = {
    appName: "adpeople",
    title: "Bairros",
    icon: QinAsset.FaceDistrict,
  };
  static PEOPLE: AdModule = {
    appName: "adpeople",
    title: "Pessoas",
    icon: QinAsset.FacePeople,
  };
  static PEOPLE_GROUP: AdModule = {
    appName: "adpeople",
    title: "Grupos de Pessoas",
    icon: QinAsset.FacePeopleGroup,
  };
  static PEOPLE_SUBGROUP: AdModule = {
    appName: "adpeople",
    title: "SubGrupos de Pessoas",
    icon: QinAsset.FacePeopleSubgroup,
  };
}
