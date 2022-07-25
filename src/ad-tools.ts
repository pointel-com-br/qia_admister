import {
  QinAsset,
  QinComboItem,
  QinComboSet,
  QinMutants,
  QinStringSet,
  QinSuggestionSet,
} from "qin_case";
import { AdField } from "./ad-field";
import { AdFilter } from "./ad-filter";
import { AdNames } from "./ad-names";

export type AdSetup = {
  module: AdModule;
  scopes: AdScope[];
  filters?: AdFilter[];
};

export enum AdScope {
  ALL = "all",
  INSERT = "insert",
  SEARCH = "search",
  NOTICE = "notice",
  RELATE = "relate",
  MUTATE = "mutate",
  DELETE = "delete",
}

export type AdModule = {
  appName: string;
  title: string;
  icon: QinAsset;
};

function isSameModule(one: AdModule, two: AdModule): boolean {
  return one?.appName == two?.appName && one?.title == two?.title;
}

function newAdSetup(module: AdModule, scopes: AdScope[], filters?: AdFilter[]): AdSetup {
  return {
    module,
    scopes,
    filters,
  };
}

function newAdSetupOption(module: AdModule, scopes: AdScope[], filters?: AdFilter[]) {
  let result = {};
  result[AdNames.AdSetup] = newAdSetup(module, scopes, filters);
  return result;
}

function newAdFieldString(name: string, title: string, maxLength: number): AdField {
  return new AdField({
    key: true,
    name: name,
    title: title,
    kind: QinMutants.STRING,
    options: {
      maxLength: maxLength,
    } as QinStringSet,
  });
}

function newAdFieldSuggestion(
  name: string,
  title: string,
  maxLength: number,
  items: string[]
): AdField {
  return new AdField({
    name: name,
    title: title,
    kind: QinMutants.SUGGESTION,
    options: {
      maxLength: maxLength,
      items: items,
    } as QinSuggestionSet,
  });
}

function newAdFieldDate(name: string, title: string): AdField {
  return new AdField({
    key: true,
    name: name,
    title: title,
    kind: QinMutants.DATE,
  });
}

function newAdFieldCombo(name: string, title: string, items: QinComboItem[]): AdField {
  return new AdField({
    name: name,
    title: title,
    kind: QinMutants.COMBO,
    options: {
      items: items,
    } as QinComboSet,
  });
}

function newAdFieldBoolean(name: string, title: string): AdField {
  return newAdFieldCombo(name, title, [
    {
      title: "",
      value: "",
    },
    {
      title: "Sim",
      value: "S",
    },
    {
      title: "Não",
      value: "N",
    },
  ]);
}

function newAdFieldAtivo(): AdField {
  return newAdFieldBoolean("ativo", "Ativo");
}

export const AdTools = {
  isSameModule,
  newAdSetup,
  newAdSetupOption,
  newAdFieldString,
  newAdFieldSuggestion,
  newAdFieldDate,
  newAdFieldCombo,
  newAdFieldBoolean,
  newAdFieldAtivo,
};
