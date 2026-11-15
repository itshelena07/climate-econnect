import type { FormState, SimilarProject } from "./types";

export const countries = ["Indonesia", "Malaysia", "Philippines", "Vietnam", "India", "Bangladesh", "Kenya", "Tanzania", "Ethiopia", "Ghana", "Peru", "Brazil", "Colombia", "Morocco", "South Africa"];
export const regions = ["Asia and the Pacific", "Sub-Saharan Africa", "Latin America and the Caribbean", "Middle East and North Africa", "Eastern Europe"];
export const sectors = [
  ["energy_generation_and_access", "Solar / Renewable Energy"], ["forest_and_land_use", "Reforestation / Forest Protection"],
  ["ecosystems_and_ecosystem_services", "Ocean / Mangrove / Wetlands"], ["transport", "Clean Transport"],
  ["buildings_cities_industries_and_appliances", "Buildings and Efficiency"], ["health_food_and_water_security", "Water and Food Security"],
  ["livelihoods_of_people_and_communities", "Livelihoods and Communities"], ["infrastructure_and_built_environment", "Climate-Resilient Infrastructure"],
] as const;
export const ldcCountries = ["Bangladesh", "Ethiopia", "Tanzania", "Kenya", "Ghana", "Nepal", "Maldives", "Vanuatu", "Samoa", "Haiti", "Niger", "Mali"];
export const gcfProjects: SimilarProject[] = [
  ["FP001","PPCR Scaling Tajikistan","Tajikistan","Eastern Europe","livelihoods",18000000,15000000,0,210000,.74],
  ["FP002","Peru SLM Program","Peru","Latin America and the Caribbean","forest",6500000,14000000,45000,120000,.82],
  ["FP003","Bangladesh Coastal Embankment","Bangladesh","Asia and the Pacific","infrastructure",40000000,38000000,0,1900000,.91],
  ["FP004","EIB Renewable Energy","Multi-country","Sub-Saharan Africa","energy",200000000,430000000,1100000,800000,.89],
  ["FP005","Maldives Coastal Protection","Maldives","Asia and the Pacific","ecosystems",8000000,4000000,0,35000,.78],
  ["FP006","Ethiopia Forest Restoration","Ethiopia","Sub-Saharan Africa","forest",12000000,8000000,95000,450000,.71],
  ["FP007","India RE Finance Facility","India","Asia and the Pacific","energy",250000000,900000000,2200000,1200000,.94],
  ["FP008","Kenya Solar Water Pumping","Kenya","Sub-Saharan Africa","water",15000000,7000000,28000,280000,.76],
  ["FP009","Philippines EE Finance","Philippines","Asia and the Pacific","buildings",100000000,200000000,890000,650000,.87],
  ["FP010","Morocco Solar IPP","Morocco","Middle East and North Africa","energy",45000000,120000000,380000,300000,.92],
  ["FP011","Tanzania Rural Electrification","Tanzania","Sub-Saharan Africa","energy",35000000,18000000,95000,750000,.79],
].map(([id,name,country,region,area,funding,cofin,co2,beneficiaries,success]) => ({ id, name, country, region, area, funding, cofin, co2, beneficiaries, success } as SimilarProject));

export const policy: Record<string, { text: string; source: string }> = {
  energy_generation_and_access: { text: "Solar PV and wind are now the lowest-cost electricity sources in most regions. Accelerated deployment in developing countries is critical to limiting warming to 1.5°C.", source: "IPCC AR6 WG3 (2022)" },
  forest_and_land_use: { text: "Forest mitigation options offer 8–14 GtCO₂/year by 2030. However, less than 25% of forest carbon credits represent real emission reductions without independent verification.", source: "West et al. Science (2023) + IPCC AR6" },
  ecosystems_and_ecosystem_services: { text: "Nature-based solutions can deliver up to 30% of near-term mitigation needed. Mangrove and wetland restoration deliver the highest co-benefit ratio of any climate investment.", source: "UNEP State of Finance for Nature (2022)" },
  infrastructure_and_built_environment: { text: "Climate-resilient infrastructure reduces long-term losses by 4:1. Mainstreaming resilience into investment decisions is among the highest-return adaptation strategies available.", source: "IPCC AR6 WG2 (2022)" },
  health_food_and_water_security: { text: "Water insecurity affects over 2 billion people. Sub-Saharan Africa faces the greatest food and water security risks, with yield declines of 8–22% projected by 2050.", source: "IPCC AR6 WG2 Ch4+5 (2022)" },
  livelihoods_of_people_and_communities: { text: "Poverty and climate vulnerability are deeply interlinked. Community-based adaptation projects that address livelihoods directly achieve the highest equity co-benefits.", source: "IPCC AR6 WG2 Ch8 (2022)" },
};

export const defaults: FormState = {
  name:"", country:"", region:"", sector:"", description:"", co2:"", beneficiaries:"",
  outcomes:"mitigation", duration:"60", revenue:"grants", funding:"", cofin:"", org:"",
  entity:"national_ngo", prior:"0", teamSize:"small", experience:"0", localPartner:false,
  pilot:false, certification:false, ldc:false, evidence:"",
};
