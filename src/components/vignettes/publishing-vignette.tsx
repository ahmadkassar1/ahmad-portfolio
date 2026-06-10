import { BrowserFrame, GreekBar, MicroAction, MiniChip, Value } from "./bits";

const posts: {
  w: string;
  status: { label: string; tone: "good" | "warn" | "neutral" };
  views: string;
}[] = [
  { w: "w-32", status: { label: "Live", tone: "good" }, views: "12.4k" },
  { w: "w-24", status: { label: "Live", tone: "good" }, views: "8.1k" },
  { w: "w-28", status: { label: "Scheduled", tone: "warn" }, views: "—" },
  { w: "w-20", status: { label: "Draft", tone: "neutral" }, views: "—" },
];

export function PublishingVignette() {
  return (
    <BrowserFrame url="studio.app/posts">
      <div className="flex items-center gap-3 border-b border-line px-3.5 py-2.5">
        <div className="flex h-6 flex-1 items-center rounded-md bg-ground/70 px-2.5">
          <GreekBar w="w-14" tone="bg-white/8" h="h-1" />
        </div>
        <MicroAction>New post</MicroAction>
      </div>
      <div className="divide-y divide-line/70">
        {posts.map((post, i) => (
          <div key={i} className="flex items-center gap-3 px-3.5 py-3">
            <span aria-hidden="true" className="h-6 w-9 shrink-0 rounded bg-white/8" />
            <div className="space-y-1.5">
              <GreekBar w={post.w} />
              <GreekBar w="w-12" tone="bg-white/6" h="h-1" />
            </div>
            <span className="ml-auto">
              <Value dim>{post.views}</Value>
            </span>
            <MiniChip tone={post.status.tone}>{post.status.label}</MiniChip>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-line px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-good" />
          <span className="font-mono text-[9px] text-ink-faint">
            Newsletter · 642 subscribers
          </span>
        </div>
        <MiniChip tone="accent">SEO 98</MiniChip>
      </div>
    </BrowserFrame>
  );
}
