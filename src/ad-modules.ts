import { QinAsset } from "qin_case";
import { AdModule } from "./ad-tools";

export class AdModules {
    static BUSINESS: AdModule = {
        appName: "adpeople",
        title: "Negócios",
        icon: QinAsset.FaceBusiness,
        registry: { name: "negocios" },
    };
    static REGION: AdModule = {
        appName: "adpeople",
        title: "Região",
        icon: QinAsset.FaceRegion,
        registry: { name: "regioes" },
    };
    static NATION: AdModule = {
        appName: "adpeople",
        title: "Países",
        icon: QinAsset.FaceGlobe,
        registry: { name: "paises" },
    };
    static STATE: AdModule = {
        appName: "adpeople",
        title: "Estados",
        icon: QinAsset.FaceState,
        registry: { name: "estados" },
    };
    static CITY: AdModule = {
        appName: "adpeople",
        title: "Cidades",
        icon: QinAsset.FaceCity,
        registry: { name: "cidades" },
    };
    static DISTRICT: AdModule = {
        appName: "adpeople",
        title: "Bairros",
        icon: QinAsset.FaceDistrict,
        registry: { name: "bairros" },
    };
    static PEOPLE: AdModule = {
        appName: "adpeople",
        title: "Pessoas",
        icon: QinAsset.FacePeople,
        registry: { name: "pessoas" },
    };
    static PEOPLE_GROUP: AdModule = {
        appName: "adpeople",
        title: "Grupos de Pessoas",
        icon: QinAsset.FacePeopleGroup,
        registry: { name: "grupos_pessoas" },
    };
    static PEOPLE_SUBGROUP: AdModule = {
        appName: "adpeople",
        title: "SubGrupos de Pessoas",
        icon: QinAsset.FacePeopleSubgroup,
        registry: { name: "subgrupos_pessoas" },
    };
    static CLIENTS: AdModule = {
        appName: "adsales",
        title: "Clientes",
        icon: QinAsset.FaceCostumer,
        registry: { name: "pessoas" },
    };
    static PRODUCTS: AdModule = {
        appName: "adsales",
        title: "Produtos",
        icon: QinAsset.FaceProduct,
        registry: { name: "produtos" },
    };
    static PRODUCTS_GROUP: AdModule = {
        appName: "adsales",
        title: "Grupos de Produtos",
        icon: QinAsset.FaceProductGroup,
        registry: { name: "grupos_produtos" },
    };
    static PRODUCTS_SUBGROUP: AdModule = {
        appName: "adsales",
        title: "SubGrupos de Produtos",
        icon: QinAsset.FaceProductSubgroup,
        registry: { name: "subgrupos_produtos" },
    };
    static PRICES: AdModule = {
        appName: "adsales",
        title: "Preços",
        icon: QinAsset.FacePrices,
        registry: { name: "precos" },
    };
    static PAYMENT_TERMS: AdModule = {
        appName: "adsales",
        title: "Condições de Pagamento",
        icon: QinAsset.FaceCheckbook,
        registry: { name: "condicoes_pagamento" },
    };
    static SALES: AdModule = {
        appName: "adsales",
        title: "Vendas",
        icon: QinAsset.FaceSales,
        registry: { name: "prepedidos" },
    };
    static SALES_ITEMS: AdModule = {
        appName: "adsales",
        title: "Vendas Itens",
        icon: QinAsset.FaceSalesItems,
        registry: { name: "itens_prepedidos" },
    };
}
