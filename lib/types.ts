export type FlagTone = "red" | "green" | "amber";
export type Grade = "A" | "B" | "C" | "D";
export type Risk = "HIGH" | "MEDIUM" | "LOW";

export type FormState = {
  name: string; country: string; region: string; sector: string; description: string;
  co2: string; beneficiaries: string; outcomes: string; duration: string; revenue: string;
  funding: string; cofin: string; org: string; entity: string; prior: string;
  teamSize: string; experience: string; localPartner: boolean; pilot: boolean;
  certification: boolean; ldc: boolean; evidence: string;
};

export type Flag = { text: string; tone: FlagTone };
export type SimilarProject = {
  id: string; name: string; country: string; region: string; area: string;
  funding: number; cofin: number; co2: number; beneficiaries: number; success: number;
};
export type Assessment = {
  score: number; grade: Grade; risk: Risk; co2Realistic: number; co2Claimed: number;
  roiMin: number; roiMax: number; sroi: number; annualRevenue: number; years: number;
  socialCo2: number; flags: Flag[]; policy?: { text: string; source: string };
  alignment: number; similar: SimilarProject[];
};
