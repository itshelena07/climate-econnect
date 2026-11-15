import { gcfProjects, ldcCountries, policy } from "./data";
import type { Assessment, Flag, FormState, Grade, Risk } from "./types";

const benchmarks: Record<string, { irr: [number, number]; integrity: number; area: string; success: [number, number] }> = {
  energy_generation_and_access:{irr:[4,9],integrity:.87,area:"energy",success:[.55,.82]}, forest_and_land_use:{irr:[-2,6],integrity:.25,area:"forest",success:[.38,.71]}, ecosystems_and_ecosystem_services:{irr:[1,5],integrity:.7,area:"ecosystems",success:[.35,.65]}, transport:{irr:[3,8],integrity:.8,area:"transport",success:[.45,.75]}, buildings_cities_industries_and_appliances:{irr:[3,7],integrity:.75,area:"buildings",success:[.48,.76]}, health_food_and_water_security:{irr:[1,5],integrity:.72,area:"water",success:[.52,.74]}, livelihoods_of_people_and_communities:{irr:[1,4],integrity:.7,area:"livelihoods",success:[.5,.72]}, infrastructure_and_built_environment:{irr:[2,6],integrity:.78,area:"infrastructure",success:[.52,.77]},
};
export function assessProject(form: FormState): Assessment | null {
  const funding = Number(form.funding) || 0, cofin = Number(form.cofin) || 0, co2 = Number(form.co2) || 0;
  const beneficiaries = Number(form.beneficiaries) || 0, years = (Number(form.duration) || 60) / 12;
  const bench = benchmarks[form.sector] ?? { irr:[2,7] as [number,number], integrity:.7, area:"", success:[.48,.72] as [number,number] };
  if (!form.sector && !form.country && !funding && !co2) return null;
  const flags: Flag[] = [], positive: Flag[] = []; let multiplier = form.entity === "international" ? 1.2 : form.entity === "private" ? .9 : .95;
  const ratio = funding + cofin ? cofin / (funding + cofin) : 0, isLdc = form.ldc || ldcCountries.includes(form.country), experienced = Number(form.prior) >= 3;
  if (ratio >= .4) { multiplier *= 1.1; positive.push({ text:`Strong co-financing (${Math.round(ratio * 100)}%)`, tone:"green" }); }
  else if (ratio < .15 && funding) { multiplier *= .9; flags.push({ text:"Low co-financing — limited external validation", tone:"amber" }); }
  if (isLdc) { multiplier *= 1.1; positive.push({ text:"LDC / SIDS — GCF priority country", tone:"green" }); }
  if (form.localPartner) { multiplier *= 1.1; positive.push({ text:"Local implementation partner identified", tone:"green" }); } else { multiplier *= .88; flags.push({ text:"No local partner — higher field execution risk", tone:"red" }); }
  if (form.pilot) { multiplier *= 1.08; positive.push({ text:"Pilot data de-risks scale-up", tone:"green" }); } else flags.push({ text:"No pilot data — unproven at scale", tone:"amber" });
  if (form.certification) { multiplier *= 1.15; positive.push({ text:"Independent certification (Verra / Gold Standard)", tone:"green" }); }
  if (experienced) positive.push({ text:`Experienced team (${form.prior}+ projects) — success rate: ${Math.round(bench.success[1]*100)}%`, tone:"green" });
  else { multiplier *= .88; flags.push({ text:`First-time team — success rate: ${Math.round(bench.success[0]*100)}%`, tone:"red" }); }
  if (beneficiaries > 500000) { multiplier *= 1.05; positive.push({ text:`Large scale: ${(beneficiaries/1000).toFixed(0)}k beneficiaries`, tone:"green" }); }
  const co2Realistic = co2 * multiplier * bench.integrity, annualRevenue = ["carbon_credits","mixed","blended"].includes(form.revenue) ? co2Realistic * 7.37 : 0;
  const roiMin = form.revenue === "grants" ? 0 : Math.max(bench.irr[0], 0), roiMax = form.revenue === "grants" ? 0 : bench.irr[1];
  const socialCo2 = co2Realistic * 185 * years, sroi = funding ? (socialCo2 + beneficiaries * 150) / funding : 0;
  let score = 50 + Math.min(multiplier * 20, 25) + Math.min(sroi * 5, 15) + (isLdc ? 5 : 0) + (form.pilot ? 3 : 0) + (form.certification ? 5 : 0) + (ratio > .3 ? 3 : 0) - (!co2 && funding ? 5 : 0);
  score = Math.round(Math.min(100, Math.max(5, score))); const grade: Grade = score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : "D"; const risk: Risk = multiplier < .75 ? "HIGH" : multiplier < .92 ? "MEDIUM" : "LOW";
  const similar = gcfProjects.filter(p => p.area === bench.area || p.region === form.region || p.country === form.country).slice(0, 3);
  return { score, grade, risk, co2Realistic, co2Claimed:co2, roiMin, roiMax, sroi, annualRevenue, years, socialCo2, flags:[...flags,...positive], policy:policy[form.sector], alignment:isLdc ? 95 : form.sector && policy[form.sector] ? 75 : 50, similar };
}
