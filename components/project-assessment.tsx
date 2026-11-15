"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { assessProject } from "@/lib/assessment";
import { countries, defaults, regions, sectors } from "@/lib/data";
import type { FormState } from "@/lib/types";
import styles from "./project-assessment.module.css";

const fieldLabels: Record<string, string> = { name:"Project name", country:"Country", region:"Region", sector:"Primary sector", description:"Project description", co2:"CO₂ avoided (tonnes / year)", beneficiaries:"Beneficiaries", duration:"Duration (months)", funding:"Funding goal (USD)", cofin:"Co-financing secured (USD)", org:"Organization name", evidence:"Supporting evidence or pilot description" };
const fmt = (n: number) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(1)}k` : n.toFixed(0);

function Field({ name, label, value, onChange, type="text", children }: { name: string; label?: string; value: string; onChange: (v:string)=>void; type?: string; children?: ReactNode }) {
  return <label className={styles.field}>{label ?? fieldLabels[name]}<span className={["name","sector","country","funding","duration","org","description"].includes(name) ? styles.required : ""}>{["name","sector","country","funding","duration","org","description"].includes(name) ? " *" : ""}</span>{children ?? <input id={`f-${name}`} name={name} type={type} value={value} onChange={e=>onChange(e.target.value)} />}</label>;
}
function SelectField({ name, label, value, options, onChange }: { name:string; label:string; value:string; options: readonly (readonly [string,string])[] | string[]; onChange:(v:string)=>void }) {
  return <label className={styles.field}>{label}<select id={`f-${name}`} value={value} onChange={e=>onChange(e.target.value)}><option value="">Select {label.toLowerCase()}</option>{options.map(o=>{const [v,l]=Array.isArray(o)?o:[o,o]; return <option key={v} value={v}>{l}</option>})}</select></label>;
}

export function ProjectAssessment() {
  const [form, setForm] = useState<FormState>(defaults); const [submitted, setSubmitted] = useState(false);
  const update = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => setForm(current => ({ ...current, [key]: value }));
  const assessment = useMemo(() => assessProject(form), [form]);
  const filled = [!!(form.name && form.sector), !!form.co2, !!form.funding, !!form.org, form.localPartner || form.pilot];
  const submit = () => { if (!form.name || !form.sector || !form.funding) { alert("Please fill in at minimum: project name, sector, and funding goal."); return; } setSubmitted(true); };
  return <main className={styles.shell}>
    <section className={styles.formPanel}>
      <header className={styles.logo}><span className={styles.logoMark}>CV</span><strong>ClimateVest</strong><small>/ project submission</small></header>
      <div className={styles.progress}>{filled.map((done,i)=><span className={done ? styles.done : (!filled.slice(0,i).includes(false) ? styles.active : "")} key={i}/>)}</div>
      <header className={styles.intro}><h1>Submit your climate project</h1><p>Complete each section and see an evidence-based impact assessment update in real time.</p></header>
      <Section title="01 — Project basics">
        <Field name="name" value={form.name} onChange={v=>update("name",v)} />
        <div className={styles.grid2}><SelectField name="country" label="Country" value={form.country} options={countries} onChange={v=>update("country",v)} /><SelectField name="region" label="Region" value={form.region} options={regions} onChange={v=>update("region",v)} /></div>
        <SelectField name="sector" label="Primary sector" value={form.sector} options={sectors} onChange={v=>update("sector",v)} />
        <Field name="description" value={form.description} onChange={v=>update("description",v)}><textarea id="f-description" value={form.description} onChange={e=>update("description",e.target.value)} placeholder="Describe the problem, solution, and expected outcomes..." /></Field>
      </Section>
      <Section title="02 — Impact claims">
        <div className={styles.grid2}><Field name="co2" type="number" value={form.co2} onChange={v=>update("co2",v)} /><Field name="beneficiaries" type="number" value={form.beneficiaries} onChange={v=>update("beneficiaries",v)} /></div>
        <div className={styles.grid3}><SelectField name="outcomes" label="Theme" value={form.outcomes} options={["mitigation","adaptation","both"]} onChange={v=>update("outcomes",v)} /><Field name="duration" type="number" value={form.duration} onChange={v=>update("duration",v)} /><SelectField name="revenue" label="Revenue model" value={form.revenue} options={[["grants","Grants only"],["carbon_credits","Carbon credits"],["energy_sales","Energy sales"],["mixed","Mixed"],["blended","Blended finance"]]} onChange={v=>update("revenue",v)} /></div>
      </Section>
      <Section title="03 — Financials"><div className={styles.grid2}><Field name="funding" type="number" value={form.funding} onChange={v=>update("funding",v)} /><Field name="cofin" type="number" value={form.cofin} onChange={v=>update("cofin",v)} /></div></Section>
      <Section title="04 — Team and credibility">
        <div className={styles.grid2}><Field name="org" value={form.org} onChange={v=>update("org",v)} /><SelectField name="entity" label="Entity type" value={form.entity} options={[["national_ngo","National NGO"],["national_govt","National Government"],["private","Private / Startup"],["international","International Body"],["research","Research Institute"]]} onChange={v=>update("entity",v)} /></div>
        <div className={styles.grid3}><SelectField name="prior" label="Prior projects" value={form.prior} options={["0","1","3","6"]} onChange={v=>update("prior",v)} /><SelectField name="teamSize" label="Team size" value={form.teamSize} options={[["small","1 to 5"],["medium","6 to 20"],["large","21 to 50"],["xlarge","50+"]]} onChange={v=>update("teamSize",v)} /><SelectField name="experience" label="Years experience" value={form.experience} options={["0","3","6","10"]} onChange={v=>update("experience",v)} /></div>
      </Section>
      <Section title="05 — Credibility signals"><div className={styles.checkGrid}>{[["localPartner","Local implementation partner"],["pilot","Pilot data available"],["certification","Third-party certification"],["ldc","LDC / SIDS country"]].map(([key,label])=><label className={styles.check} key={key}><input type="checkbox" checked={form[key as keyof FormState] as boolean} onChange={e=>update(key as keyof FormState,e.target.checked)} />{label}</label>)}</div><Field name="evidence" value={form.evidence} onChange={v=>update("evidence",v)}><textarea id="f-evidence" value={form.evidence} onChange={e=>update("evidence",e.target.value)} placeholder="Describe pilot results, certifications, letters of support..." /></Field></Section>
      <button className={styles.submit} onClick={submit}>{submitted ? "Assessment submitted" : "Submit for full assessment"}</button>
    </section>
    <AssessmentPanel assessment={assessment} />
  </main>;
}

function Section({ title, children }: { title:string; children:ReactNode }) { return <section className={styles.section}><h2>{title}</h2>{children}</section>; }
function AssessmentPanel({ assessment }: { assessment: ReturnType<typeof assessProject> }) {
  if (!assessment) return <aside className={styles.aiPanel}><div className={styles.aiHeader}><span>Live assessment</span><small>waiting for input</small></div><div className={styles.empty}><span>◯</span><p>Start filling the form and your project&apos;s impact score and ROI will appear here in real time.</p></div></aside>;
  const a = assessment, gradeColor = `grade${a.grade}`;
  return <aside className={styles.aiPanel}><div className={styles.aiHeader}><span>Live assessment</span><small className={styles.ready}>● live</small></div><div className={styles.gaugeCard}><div className={`${styles.gauge} ${styles[gradeColor]}`}><strong>{a.score}</strong><small>/ 100</small></div><div><small>IMPACT GRADE</small><h2 className={styles[gradeColor]}>{a.grade}</h2><p>{a.grade==="A"?"Strong impact — well-structured project":a.grade==="B"?"Good potential — address risk flags to improve":a.grade==="C"?"Moderate — significant credibility gaps remain":"High risk — major improvements needed"}</p></div></div>
    <div className={styles.metrics}><Metric label="CO₂ realistic" value={a.co2Realistic ? fmt(a.co2Realistic) : "N/A"} sub={a.co2Claimed ? `${Math.round(a.co2Realistic/a.co2Claimed*100)}% of claimed` : "No CO₂ claim entered"} /><Metric label="Financial ROI" value={a.roiMax ? `${a.roiMin}%–${a.roiMax}%` : "0%"} sub={a.roiMax ? "annualized estimate" : "Grant-funded — impact only"} /><Metric label="Social return" value={a.sroi ? `${a.sroi.toFixed(1)}x` : "—"} sub="per $1 invested (SROI)" /><Metric label="Risk level" value={a.risk} sub="team and structure" tone={a.risk.toLowerCase()} /></div>
    {a.policy && <Card title="Policy alignment"><div className={styles.alignment}><span style={{width:`${a.alignment}%`}} /><b>{a.alignment >= 95 ? "Very high" : "High"}</b></div><blockquote>&ldquo;{a.policy.text}&rdquo;<cite>{a.policy.source}</cite></blockquote></Card>}
    {a.flags.length > 0 && <Card title="Signals"><ul className={styles.flags}>{a.flags.map((f,i)=><li className={f.tone} key={i}><b>{f.tone==="green"?"✓":f.tone==="red"?"×":"!"}</b>{f.text}</li>)}</ul></Card>}
    {a.similar.length > 0 && <Card title="Similar GCF projects"><ul className={styles.similar}>{a.similar.map(p=><li key={p.id}><span><b>{p.id}</b><small>{p.country} · ${(p.funding/1e6).toFixed(1)}M</small></span><em className={p.success >= .85 ? styles.high : p.success >= .7 ? styles.mid : styles.low}>{p.success >= .85 ? "strong" : p.success >= .7 ? "moderate" : "mixed"}</em></li>)}</ul></Card>}
  </aside>;
}
function Metric({label,value,sub,tone}:{label:string;value:string;sub:string;tone?:string}) { return <div className={styles.metric}><small>{label}</small><strong className={tone ? styles[tone] : ""}>{value}</strong><span>{sub}</span></div>; }
function Card({title,children}:{title:string;children:ReactNode}) { return <section className={styles.card}><h3>{title}</h3>{children}</section>; }
