export function SectionHeading({ label, title, id }: { label: string; title: string; id: string }) {
  return <div className="section-heading"><p className="eyebrow">{label}</p><h2 id={id}>{title}</h2></div>;
}
