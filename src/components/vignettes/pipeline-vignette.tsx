import { BrowserFrame, GreekBar, MiniChip, Sparkline, Value } from "./bits";

const kpis = [
  { label: "Leads", value: "128" },
  { label: "Qualified", value: "41" },
  { label: "Won", value: "12" },
];

const rows: {
  w: string;
  source: string;
  value: string;
  status: { label: string; tone: "good" | "warn" | "accent" | "neutral" };
}[] = [
  { w: "w-24", source: "Form", value: "$4.2k", status: { label: "Contacted", tone: "warn" } },
  { w: "w-16", source: "n8n", value: "$1.8k", status: { label: "AI draft", tone: "accent" } },
  { w: "w-20", source: "Referral", value: "$6.5k", status: { label: "Won", tone: "good" } },
  { w: "w-14", source: "Form", value: "$950", status: { label: "New", tone: "neutral" } },
];

export function PipelineVignette() {
  return (
    <BrowserFrame url="pipeline.app/deals">
      <div className="grid grid-cols-3 gap-px border-b border-line bg-line/40">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-panel px-3.5 py-2.5">
            <p className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">
              {kpi.label}
            </p>
            <p className="mt-0.5 font-mono text-sm text-ink">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="divide-y divide-line/70">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3 px-3.5 py-2.5">
            <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-full bg-white/8" />
            <GreekBar w={row.w} />
            <MiniChip>{row.source}</MiniChip>
            <span className="ml-auto"><Value>{row.value}</Value></span>
            <MiniChip tone={row.status.tone}>{row.status.label}</MiniChip>
          </div>
        ))}
      </div>
      <div className="flex items-end justify-between gap-4 border-t border-line px-3.5 py-2.5">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">
            Pipeline value
          </p>
          <p className="font-mono text-sm text-ink">$13.4k</p>
        </div>
        <Sparkline className="h-7 w-28" />
      </div>
    </BrowserFrame>
  );
}
