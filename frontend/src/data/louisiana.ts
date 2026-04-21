/**
 * Louisiana geography, sectors, and employers.
 *
 * Sources:
 *   - LWC Regional Labor Market Areas (8-region breakdown)
 *     https://www.laworks.net/LaborMarketInfo/
 *   - U.S. Census Bureau 2020 decennial + 2023 ACS 5-year estimates
 *     (population, median household income, public domain)
 *   - Louisiana Economic Development (opportunityLouisiana.gov) —
 *     megaproject announcements
 *
 * Every parish carries its RLMA, a best-available population figure, and the
 * employer IDs with a public presence in that parish. Employer records live
 * alongside so the import graph stays flat.
 */

import type {
  Employer,
  Parish,
  RLMA,
  Sector,
} from "./types"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  RLMAs — 8 Regional Labor Market Areas per LWC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const RLMAS: readonly RLMA[] = [
  {
    id: "RLMA-1",
    name: "New Orleans Region",
    description:
      "The Greater New Orleans metropolitan region — the state's largest labor market, anchored by the Port of New Orleans and the SSE Steel / Persona AI humanoid pilot in St. Bernard Parish.",
    anchorProject: "SSE Steel Fabrication / Persona AI (St. Bernard)",
    parishIds: [
      "orleans",
      "jefferson",
      "plaquemines",
      "st-bernard",
      "st-charles",
      "st-john-the-baptist",
      "st-tammany",
    ],
  },
  {
    id: "RLMA-2",
    name: "Capital / Baton Rouge Region",
    description:
      "Louisiana's capital region and the heart of the Mississippi River industrial corridor. Home to the Hyundai Steel megaproject in Ascension and the Hut 8 / Jacobs HPC campus in West Feliciana.",
    anchorProject: "Hyundai Steel (Ascension); Hut 8 / Jacobs (West Feliciana)",
    parishIds: [
      "ascension",
      "east-baton-rouge",
      "east-feliciana",
      "iberville",
      "livingston",
      "pointe-coupee",
      "st-helena",
      "tangipahoa",
      "washington",
      "west-baton-rouge",
      "west-feliciana",
    ],
  },
  {
    id: "RLMA-3",
    name: "Houma / Bayou Region",
    description:
      "Coastal parishes built around offshore energy, commercial fishing, and maritime fabrication. Deep concentration of petroleum and fabricated-metal occupations.",
    anchorProject: "Offshore energy and marine fabrication",
    parishIds: [
      "assumption",
      "lafourche",
      "st-james",
      "st-mary",
      "terrebonne",
    ],
  },
  {
    id: "RLMA-4",
    name: "Lafayette / Acadiana Region",
    description:
      "Acadiana's labor market — oilfield services, healthcare systems, and a growing tech cluster. LSU Health Lafayette and Ochsner Lafayette General anchor healthcare.",
    anchorProject: "Oilfield services; healthcare AI",
    parishIds: [
      "acadia",
      "evangeline",
      "iberia",
      "lafayette",
      "st-landry",
      "st-martin",
      "vermilion",
    ],
  },
  {
    id: "RLMA-5",
    name: "Southwest / Lake Charles Region",
    description:
      "The Lake Charles LNG and petrochemical corridor — among the largest concentrations of process-operator, chemical-engineering, and marine-logistics jobs in the Gulf.",
    anchorProject: "LNG / petrochemical corridor",
    parishIds: [
      "allen",
      "beauregard",
      "calcasieu",
      "cameron",
      "jefferson-davis",
    ],
  },
  {
    id: "RLMA-6",
    name: "Central / Alexandria Region",
    description:
      "Central Louisiana, spanning Fort Johnson (Joint Readiness Training Center) and the agribusiness belt around Alexandria. Significant public-administration and healthcare employment.",
    anchorProject: "Fort Johnson (military); agribusiness",
    parishIds: [
      "avoyelles",
      "catahoula",
      "concordia",
      "grant",
      "la-salle",
      "rapides",
      "vernon",
      "winn",
    ],
  },
  {
    id: "RLMA-7",
    name: "Northwest / Shreveport Region",
    description:
      "The Ark-La-Tex region, home to the Amazon AWS Caddo/Bossier $12B three-campus buildout and the region's largest healthcare system, Willis-Knighton.",
    anchorProject: "Amazon AWS (Caddo/Bossier, $12B, 3 campuses)",
    parishIds: [
      "bienville",
      "bossier",
      "caddo",
      "claiborne",
      "de-soto",
      "natchitoches",
      "red-river",
      "sabine",
      "webster",
    ],
  },
  {
    id: "RLMA-8",
    name: "Northeast / Monroe Region",
    description:
      "Northeast Louisiana, anchored by the Meta Hyperion data-center campus in Richland Parish and the University of Louisiana at Monroe. Agricultural and logistics employment predominate.",
    anchorProject: "Meta Hyperion data center (Richland)",
    parishIds: [
      "caldwell",
      "east-carroll",
      "franklin",
      "jackson",
      "lincoln",
      "madison",
      "morehouse",
      "ouachita",
      "richland",
      "tensas",
      "union",
      "west-carroll",
    ],
  },
] as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Parishes — all 64, RLMA-tagged
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Each parish entry pairs a Census 2020 population figure with the 5-year ACS
 * (2019-2023) median household income. Figures are rounded to the nearest
 * hundred. `majorEmployerIds` lists employers with a publicly-reported
 * presence in the parish; see EMPLOYERS for the source of each entry.
 */
export const PARISHES: readonly Parish[] = [
  // RLMA-1 — New Orleans Region
  { id: "orleans", name: "Orleans", rlma: "RLMA-1", population: 383_997, medianHouseholdIncome: 51_400, majorEmployerIds: ["ochsner", "lcmc-health", "port-new-orleans", "entergy-louisiana"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "jefferson", name: "Jefferson", rlma: "RLMA-1", population: 440_781, medianHouseholdIncome: 58_700, majorEmployerIds: ["ochsner", "exxonmobil-chalmette", "entergy-louisiana"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "plaquemines", name: "Plaquemines", rlma: "RLMA-1", population: 23_515, medianHouseholdIncome: 67_200, majorEmployerIds: ["chevron", "shell-gulf", "port-south-louisiana"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "st-bernard", name: "St. Bernard", rlma: "RLMA-1", population: 43_764, medianHouseholdIncome: 56_100, majorEmployerIds: ["sse-persona-ai", "exxonmobil-chalmette"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "st-charles", name: "St. Charles", rlma: "RLMA-1", population: 52_549, medianHouseholdIncome: 74_500, majorEmployerIds: ["dow-chemical", "shell-gulf", "entergy-louisiana"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "st-john-the-baptist", name: "St. John the Baptist", rlma: "RLMA-1", population: 42_477, medianHouseholdIncome: 53_200, majorEmployerIds: ["marathon-petroleum", "entergy-louisiana"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "st-tammany", name: "St. Tammany", rlma: "RLMA-1", population: 264_570, medianHouseholdIncome: 74_800, majorEmployerIds: ["ochsner", "chevron"], sourceCitation: "Census 2020; ACS 2023 5-yr" },

  // RLMA-2 — Capital / Baton Rouge Region
  { id: "ascension", name: "Ascension", rlma: "RLMA-2", population: 126_604, medianHouseholdIncome: 86_400, majorEmployerIds: ["hyundai-steel", "exxonmobil-baton-rouge", "shell-gulf"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "east-baton-rouge", name: "East Baton Rouge", rlma: "RLMA-2", population: 456_781, medianHouseholdIncome: 60_200, majorEmployerIds: ["exxonmobil-baton-rouge", "ochsner", "lsu-health", "entergy-louisiana"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "east-feliciana", name: "East Feliciana", rlma: "RLMA-2", population: 19_539, medianHouseholdIncome: 50_100, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "iberville", name: "Iberville", rlma: "RLMA-2", population: 30_241, medianHouseholdIncome: 57_900, majorEmployerIds: ["dow-chemical"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "livingston", name: "Livingston", rlma: "RLMA-2", population: 142_282, medianHouseholdIncome: 75_900, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "pointe-coupee", name: "Pointe Coupee", rlma: "RLMA-2", population: 20_758, medianHouseholdIncome: 52_400, majorEmployerIds: ["entergy-louisiana"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "st-helena", name: "St. Helena", rlma: "RLMA-2", population: 10_216, medianHouseholdIncome: 45_800, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "tangipahoa", name: "Tangipahoa", rlma: "RLMA-2", population: 133_777, medianHouseholdIncome: 54_600, majorEmployerIds: ["ochsner"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "washington", name: "Washington", rlma: "RLMA-2", population: 45_463, medianHouseholdIncome: 46_100, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "west-baton-rouge", name: "West Baton Rouge", rlma: "RLMA-2", population: 27_206, medianHouseholdIncome: 72_800, majorEmployerIds: ["port-greater-baton-rouge"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "west-feliciana", name: "West Feliciana", rlma: "RLMA-2", population: 15_310, medianHouseholdIncome: 81_300, majorEmployerIds: ["hut-8-jacobs", "entergy-louisiana"], sourceCitation: "Census 2020; ACS 2023 5-yr" },

  // RLMA-3 — Houma / Bayou Region
  { id: "assumption", name: "Assumption", rlma: "RLMA-3", population: 21_039, medianHouseholdIncome: 55_800, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "lafourche", name: "Lafourche", rlma: "RLMA-3", population: 97_557, medianHouseholdIncome: 61_400, majorEmployerIds: ["chevron", "port-fourchon"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "st-james", name: "St. James", rlma: "RLMA-3", population: 20_192, medianHouseholdIncome: 66_700, majorEmployerIds: ["marathon-petroleum"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "st-mary", name: "St. Mary", rlma: "RLMA-3", population: 49_348, medianHouseholdIncome: 49_700, majorEmployerIds: ["chevron"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "terrebonne", name: "Terrebonne", rlma: "RLMA-3", population: 109_580, medianHouseholdIncome: 57_900, majorEmployerIds: ["ochsner", "chevron"], sourceCitation: "Census 2020; ACS 2023 5-yr" },

  // RLMA-4 — Lafayette / Acadiana Region
  { id: "acadia", name: "Acadia", rlma: "RLMA-4", population: 57_576, medianHouseholdIncome: 50_900, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "evangeline", name: "Evangeline", rlma: "RLMA-4", population: 32_350, medianHouseholdIncome: 44_200, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "iberia", name: "Iberia", rlma: "RLMA-4", population: 69_043, medianHouseholdIncome: 52_400, majorEmployerIds: ["chevron"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "lafayette", name: "Lafayette", rlma: "RLMA-4", population: 241_753, medianHouseholdIncome: 60_200, majorEmployerIds: ["ochsner", "lsu-health"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "st-landry", name: "St. Landry", rlma: "RLMA-4", population: 82_540, medianHouseholdIncome: 44_800, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "st-martin", name: "St. Martin", rlma: "RLMA-4", population: 51_767, medianHouseholdIncome: 50_600, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "vermilion", name: "Vermilion", rlma: "RLMA-4", population: 57_359, medianHouseholdIncome: 55_200, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },

  // RLMA-5 — Southwest / Lake Charles Region
  { id: "allen", name: "Allen", rlma: "RLMA-5", population: 22_750, medianHouseholdIncome: 47_100, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "beauregard", name: "Beauregard", rlma: "RLMA-5", population: 36_549, medianHouseholdIncome: 55_900, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "calcasieu", name: "Calcasieu", rlma: "RLMA-5", population: 216_785, medianHouseholdIncome: 60_100, majorEmployerIds: ["sasol", "cheniere-sabine-pass", "phillips-66-lake-charles", "entergy-louisiana"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "cameron", name: "Cameron", rlma: "RLMA-5", population: 5_617, medianHouseholdIncome: 81_900, majorEmployerIds: ["cheniere-sabine-pass", "venture-global-calcasieu"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "jefferson-davis", name: "Jefferson Davis", rlma: "RLMA-5", population: 32_508, medianHouseholdIncome: 53_400, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },

  // RLMA-6 — Central / Alexandria Region
  { id: "avoyelles", name: "Avoyelles", rlma: "RLMA-6", population: 39_693, medianHouseholdIncome: 43_900, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "catahoula", name: "Catahoula", rlma: "RLMA-6", population: 9_063, medianHouseholdIncome: 40_200, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "concordia", name: "Concordia", rlma: "RLMA-6", population: 19_259, medianHouseholdIncome: 38_500, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "grant", name: "Grant", rlma: "RLMA-6", population: 22_145, medianHouseholdIncome: 52_700, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "la-salle", name: "La Salle", rlma: "RLMA-6", population: 14_738, medianHouseholdIncome: 53_100, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "rapides", name: "Rapides", rlma: "RLMA-6", population: 129_648, medianHouseholdIncome: 51_300, majorEmployerIds: ["ochsner", "lsu-health"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "vernon", name: "Vernon", rlma: "RLMA-6", population: 47_429, medianHouseholdIncome: 51_000, majorEmployerIds: ["fort-johnson"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "winn", name: "Winn", rlma: "RLMA-6", population: 13_904, medianHouseholdIncome: 42_600, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },

  // RLMA-7 — Northwest / Shreveport Region
  { id: "bienville", name: "Bienville", rlma: "RLMA-7", population: 12_981, medianHouseholdIncome: 41_300, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "bossier", name: "Bossier", rlma: "RLMA-7", population: 128_746, medianHouseholdIncome: 67_200, majorEmployerIds: ["amazon-aws", "willis-knighton"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "caddo", name: "Caddo", rlma: "RLMA-7", population: 237_848, medianHouseholdIncome: 50_900, majorEmployerIds: ["amazon-aws", "willis-knighton", "lsu-health"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "claiborne", name: "Claiborne", rlma: "RLMA-7", population: 14_203, medianHouseholdIncome: 37_500, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "de-soto", name: "De Soto", rlma: "RLMA-7", population: 27_463, medianHouseholdIncome: 52_400, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "natchitoches", name: "Natchitoches", rlma: "RLMA-7", population: 37_515, medianHouseholdIncome: 41_900, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "red-river", name: "Red River", rlma: "RLMA-7", population: 7_620, medianHouseholdIncome: 43_500, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "sabine", name: "Sabine", rlma: "RLMA-7", population: 22_155, medianHouseholdIncome: 48_800, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "webster", name: "Webster", rlma: "RLMA-7", population: 36_940, medianHouseholdIncome: 44_200, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },

  // RLMA-8 — Northeast / Monroe Region
  { id: "caldwell", name: "Caldwell", rlma: "RLMA-8", population: 9_599, medianHouseholdIncome: 46_800, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "east-carroll", name: "East Carroll", rlma: "RLMA-8", population: 6_861, medianHouseholdIncome: 30_100, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "franklin", name: "Franklin", rlma: "RLMA-8", population: 19_774, medianHouseholdIncome: 40_900, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "jackson", name: "Jackson", rlma: "RLMA-8", population: 15_031, medianHouseholdIncome: 44_700, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "lincoln", name: "Lincoln", rlma: "RLMA-8", population: 48_396, medianHouseholdIncome: 43_500, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "madison", name: "Madison", rlma: "RLMA-8", population: 10_017, medianHouseholdIncome: 33_700, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "morehouse", name: "Morehouse", rlma: "RLMA-8", population: 24_874, medianHouseholdIncome: 37_900, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "ouachita", name: "Ouachita", rlma: "RLMA-8", population: 160_368, medianHouseholdIncome: 49_700, majorEmployerIds: ["ochsner", "entergy-louisiana"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "richland", name: "Richland", rlma: "RLMA-8", population: 20_122, medianHouseholdIncome: 45_100, majorEmployerIds: ["meta-hyperion"], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "tensas", name: "Tensas", rlma: "RLMA-8", population: 4_190, medianHouseholdIncome: 38_500, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "union", name: "Union", rlma: "RLMA-8", population: 22_108, medianHouseholdIncome: 47_300, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
  { id: "west-carroll", name: "West Carroll", rlma: "RLMA-8", population: 10_939, medianHouseholdIncome: 42_700, majorEmployerIds: [], sourceCitation: "Census 2020; ACS 2023 5-yr" },
] as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Sectors (Louisiana-relevant NAICS roll-ups)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SECTORS: readonly Sector[] = [
  {
    id: "energy-petrochemicals",
    label: "Energy & Petrochemicals",
    description:
      "Oil and gas extraction, refining, LNG export, petrochemical production, pipeline operations, and offshore services.",
    relatedNAICS: ["211", "213", "324", "325", "486"],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    description:
      "Steel fabrication, chemical manufacturing, primary metals, shipbuilding, and precision machining across Louisiana's industrial corridor.",
    relatedNAICS: ["31", "32", "33"],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    description:
      "Hospitals, ambulatory care, medical practices, nursing and residential facilities. Anchored by Ochsner, LCMC, LSU Health, and Willis-Knighton.",
    relatedNAICS: ["621", "622", "623"],
  },
  {
    id: "logistics-ports",
    label: "Logistics & Ports",
    description:
      "Water transportation, trucking, warehousing, and port operations. Includes Port of South Louisiana, Port NOLA, Port Fourchon, Port Greater Baton Rouge.",
    relatedNAICS: ["481", "482", "483", "484", "488", "493"],
  },
  {
    id: "agriculture",
    label: "Agriculture",
    description:
      "Crop production (rice, sugarcane, soybeans, cotton), forestry, aquaculture, and food processing.",
    relatedNAICS: ["111", "112", "113", "311"],
  },
  {
    id: "finance-insurance",
    label: "Finance & Insurance",
    description:
      "Commercial banking, insurance carriers, credit intermediation, and investment services.",
    relatedNAICS: ["52"],
  },
  {
    id: "education",
    label: "Education",
    description:
      "K-12 public and private education, community and technical colleges (LCTCS), and higher education (LSU, ULL, ULM, Tulane).",
    relatedNAICS: ["61"],
  },
  {
    id: "public-administration",
    label: "Public Administration",
    description:
      "Federal, state, parish, and municipal government; military installations; public safety and justice administration.",
    relatedNAICS: ["92"],
  },
  {
    id: "technology",
    label: "Technology & Data Centers",
    description:
      "Software development, data center operations, telecom, and cloud infrastructure. Rapidly growing with Meta Hyperion and AWS Caddo/Bossier.",
    relatedNAICS: ["518", "519", "541"],
  },
  {
    id: "construction",
    label: "Construction",
    description:
      "Heavy civil, industrial, commercial, and residential construction — including the tens of thousands of construction jobs spun up by megaproject builds.",
    relatedNAICS: ["23"],
  },
  {
    id: "retail-hospitality",
    label: "Retail & Hospitality",
    description:
      "Retail trade, accommodation, food services, tourism, and entertainment — outsized in New Orleans but present statewide.",
    relatedNAICS: ["44", "45", "72"],
  },
] as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Employers — priority LA employers and megaproject owners
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const EMPLOYERS: readonly Employer[] = [
  // Megaprojects (announced 2023-2025)
  {
    id: "meta-hyperion",
    name: "Meta — Hyperion Data Center",
    sector: "technology",
    parishIds: ["richland"],
    isPriorityLA: true,
    isMegaproject: true,
    description:
      "Meta's $10B+ Hyperion AI data-center campus in Richland Parish — the largest single data-center investment in Louisiana history. Announced 2024.",
  },
  {
    id: "amazon-aws",
    name: "Amazon Web Services",
    sector: "technology",
    parishIds: ["caddo", "bossier"],
    isPriorityLA: true,
    isMegaproject: true,
    description:
      "AWS's $12B three-campus data-center buildout across Caddo and Bossier Parishes. Announced 2024.",
  },
  {
    id: "hyundai-steel",
    name: "Hyundai Steel",
    sector: "manufacturing",
    parishIds: ["ascension"],
    isPriorityLA: true,
    isMegaproject: true,
    description:
      "Hyundai Steel's $5.8B low-carbon steel plant in Ascension Parish, projected to employ 1,400+. Announced 2025.",
  },
  {
    id: "hut-8-jacobs",
    name: "Hut 8 / Jacobs HPC Campus",
    sector: "technology",
    parishIds: ["west-feliciana"],
    isPriorityLA: true,
    isMegaproject: true,
    description:
      "Hut 8 and Jacobs HPC colocation campus in West Feliciana Parish, targeting AI/HPC workloads.",
  },
  {
    id: "sse-persona-ai",
    name: "SSE Steel Fabrication / Persona AI",
    sector: "manufacturing",
    parishIds: ["st-bernard"],
    isPriorityLA: true,
    isMegaproject: true,
    description:
      "SSE Steel Fabrication's partnership with Persona AI to pilot humanoid robots in structural steel fabrication — St. Bernard Parish.",
  },
  // Anchor employers (persistent, large-workforce)
  {
    id: "ochsner",
    name: "Ochsner Health System",
    sector: "healthcare",
    parishIds: ["orleans", "jefferson", "st-tammany", "lafayette", "tangipahoa", "terrebonne", "rapides", "ouachita"],
    isPriorityLA: true,
    isMegaproject: false,
    description:
      "Louisiana's largest private healthcare system, with 40+ hospitals and clinics statewide.",
  },
  {
    id: "lcmc-health",
    name: "LCMC Health",
    sector: "healthcare",
    parishIds: ["orleans"],
    isPriorityLA: true,
    isMegaproject: false,
    description:
      "New Orleans-anchored hospital system operating Children's Hospital New Orleans, Touro, and several other campuses.",
  },
  {
    id: "lsu-health",
    name: "LSU Health Sciences",
    sector: "healthcare",
    parishIds: ["east-baton-rouge", "caddo", "lafayette", "rapides"],
    isPriorityLA: true,
    isMegaproject: false,
    description:
      "Louisiana State University Health Sciences Centers in New Orleans and Shreveport plus clinical affiliates.",
  },
  {
    id: "willis-knighton",
    name: "Willis-Knighton Health System",
    sector: "healthcare",
    parishIds: ["caddo", "bossier"],
    isPriorityLA: true,
    isMegaproject: false,
    description: "Largest independent hospital system in northwest Louisiana.",
  },
  {
    id: "entergy-louisiana",
    name: "Entergy Louisiana",
    sector: "energy-petrochemicals",
    parishIds: ["orleans", "jefferson", "st-charles", "st-john-the-baptist", "east-baton-rouge", "ascension", "west-feliciana", "pointe-coupee", "calcasieu", "ouachita"],
    isPriorityLA: true,
    isMegaproject: false,
    description:
      "Primary investor-owned electric utility serving most of south and central Louisiana.",
  },
  {
    id: "exxonmobil-baton-rouge",
    name: "ExxonMobil Baton Rouge Complex",
    sector: "energy-petrochemicals",
    parishIds: ["east-baton-rouge", "ascension"],
    isPriorityLA: true,
    isMegaproject: false,
    description:
      "ExxonMobil's Baton Rouge refinery and petrochemical complex — one of the largest in the United States.",
  },
  {
    id: "exxonmobil-chalmette",
    name: "ExxonMobil Chalmette Refining",
    sector: "energy-petrochemicals",
    parishIds: ["st-bernard", "jefferson"],
    isPriorityLA: false,
    isMegaproject: false,
    description: "Chalmette Refining operations on the east bank of the Mississippi.",
  },
  {
    id: "chevron",
    name: "Chevron (Gulf Operations)",
    sector: "energy-petrochemicals",
    parishIds: ["plaquemines", "st-mary", "terrebonne", "lafourche", "iberia"],
    isPriorityLA: true,
    isMegaproject: false,
    description: "Gulf of Mexico upstream and midstream operations with multi-parish footprint.",
  },
  {
    id: "shell-gulf",
    name: "Shell (Gulf Operations)",
    sector: "energy-petrochemicals",
    parishIds: ["plaquemines", "st-charles", "ascension"],
    isPriorityLA: true,
    isMegaproject: false,
    description: "Shell's Gulf of Mexico E&P and Convent refining operations.",
  },
  {
    id: "marathon-petroleum",
    name: "Marathon Petroleum Garyville",
    sector: "energy-petrochemicals",
    parishIds: ["st-john-the-baptist", "st-james"],
    isPriorityLA: false,
    isMegaproject: false,
    description: "Marathon's Garyville refinery — a Mississippi River corridor anchor.",
  },
  {
    id: "dow-chemical",
    name: "Dow Louisiana",
    sector: "energy-petrochemicals",
    parishIds: ["iberville", "st-charles"],
    isPriorityLA: true,
    isMegaproject: false,
    description: "Dow's Plaquemine (Iberville) and Norco-area chemical manufacturing.",
  },
  {
    id: "sasol",
    name: "Sasol Lake Charles",
    sector: "energy-petrochemicals",
    parishIds: ["calcasieu"],
    isPriorityLA: true,
    isMegaproject: false,
    description: "Sasol's Lake Charles Chemical Complex — ethane cracker and derivatives.",
  },
  {
    id: "cheniere-sabine-pass",
    name: "Cheniere LNG Sabine Pass",
    sector: "energy-petrochemicals",
    parishIds: ["cameron", "calcasieu"],
    isPriorityLA: true,
    isMegaproject: false,
    description: "The first LNG export terminal in the lower 48 — a Gulf Coast LNG anchor.",
  },
  {
    id: "venture-global-calcasieu",
    name: "Venture Global Calcasieu Pass",
    sector: "energy-petrochemicals",
    parishIds: ["cameron"],
    isPriorityLA: true,
    isMegaproject: false,
    description: "Venture Global's Calcasieu Pass LNG export terminal.",
  },
  {
    id: "phillips-66-lake-charles",
    name: "Phillips 66 Lake Charles Refinery",
    sector: "energy-petrochemicals",
    parishIds: ["calcasieu"],
    isPriorityLA: false,
    isMegaproject: false,
    description: "Phillips 66 Lake Charles refinery and petrochemical assets.",
  },
  {
    id: "port-new-orleans",
    name: "Port of New Orleans",
    sector: "logistics-ports",
    parishIds: ["orleans"],
    isPriorityLA: true,
    isMegaproject: false,
    description: "Largest container port on the lower Mississippi.",
  },
  {
    id: "port-south-louisiana",
    name: "Port of South Louisiana",
    sector: "logistics-ports",
    parishIds: ["st-charles", "st-john-the-baptist", "st-james", "plaquemines"],
    isPriorityLA: true,
    isMegaproject: false,
    description: "Largest tonnage port in the Western Hemisphere; bulk grain and petroleum.",
  },
  {
    id: "port-fourchon",
    name: "Port Fourchon",
    sector: "logistics-ports",
    parishIds: ["lafourche"],
    isPriorityLA: true,
    isMegaproject: false,
    description: "Primary service port for Gulf of Mexico deepwater oil and gas.",
  },
  {
    id: "port-greater-baton-rouge",
    name: "Port of Greater Baton Rouge",
    sector: "logistics-ports",
    parishIds: ["west-baton-rouge", "east-baton-rouge"],
    isPriorityLA: false,
    isMegaproject: false,
    description: "Ninth-largest U.S. port by tonnage; strategic rail-barge intermodal.",
  },
  {
    id: "fort-johnson",
    name: "Fort Johnson (Joint Readiness Training Center)",
    sector: "public-administration",
    parishIds: ["vernon"],
    isPriorityLA: true,
    isMegaproject: false,
    description: "U.S. Army's Joint Readiness Training Center at Fort Johnson (formerly Fort Polk).",
  },
] as const

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Look up the RLMA that contains the given parish id. Undefined if not found. */
export function rlmaForParish(parishId: string): RLMA | undefined {
  return RLMAS.find((r) => r.parishIds.includes(parishId))
}

/** Look up a parish by its kebab-case id. Undefined if not found. */
export function parishById(parishId: string) {
  return PARISHES.find((p) => p.id === parishId)
}

/** Look up an employer by id. Undefined if not found. */
export function employerById(employerId: string) {
  return EMPLOYERS.find((e) => e.id === employerId)
}

/** Employers in the given parish. */
export function employersInParish(parishId: string): readonly Employer[] {
  return EMPLOYERS.filter((e) => e.parishIds.includes(parishId))
}

/** Employers in any parish of the given RLMA. */
export function employersInRLMA(rlmaId: string): readonly Employer[] {
  const rlma = RLMAS.find((r) => r.id === rlmaId)
  if (!rlma) return []
  return EMPLOYERS.filter((e) =>
    e.parishIds.some((pid) => rlma.parishIds.includes(pid)),
  )
}
