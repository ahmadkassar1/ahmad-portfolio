import { GreekBar, MiniChip, PhoneFrame, Value } from "./bits";

const categories = ["Grill", "Wraps", "Drinks", "Dessert"];

const items: { w: string; price: string }[] = [
  { w: "w-20", price: "$8.50" },
  { w: "w-14", price: "$6.00" },
  { w: "w-24", price: "$11.00" },
  { w: "w-16", price: "$4.50" },
];

export function QrMenuVignette() {
  return (
    <div className="relative">
      {/* Admin panel sits behind the phone — the operator side of the product. */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-8 hidden w-56 rounded-xl border border-line bg-panel/80 p-3.5 opacity-80 sm:block"
      >
        <div className="flex items-center justify-between">
          <GreekBar w="w-16" tone="bg-white/15" />
          <MiniChip tone="accent">+ Item</MiniChip>
        </div>
        <div className="mt-3 space-y-2.5">
          {["w-28", "w-20", "w-24"].map((w, i) => (
            <div key={i} className="flex items-center justify-between">
              <GreekBar w={w} />
              <GreekBar w="w-6" tone="bg-white/15" />
            </div>
          ))}
        </div>
      </div>

      <PhoneFrame className="relative mx-auto w-48 sm:ml-auto sm:mr-4">
        <div className="px-3.5 pb-3.5 pt-3">
          <GreekBar w="w-20" h="h-2" tone="bg-white/20" />
          <div className="mt-3 flex gap-1.5 overflow-hidden">
            {categories.map((category, i) => (
              <span
                key={category}
                className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] ${
                  i === 0 ? "bg-accent font-medium text-ground" : "bg-white/8 text-ink-faint"
                }`}
              >
                {category}
              </span>
            ))}
          </div>
          <div className="mt-3.5 space-y-2.5">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 rounded-lg border border-line bg-panel p-2"
              >
                <span aria-hidden="true" className="h-7 w-7 shrink-0 rounded-md bg-white/8" />
                <div className="space-y-1.5">
                  <GreekBar w={item.w} />
                  <GreekBar w="w-10" tone="bg-white/6" h="h-1" />
                </div>
                <span className="ml-auto">
                  <Value>{item.price}</Value>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3.5 flex items-center justify-between rounded-lg bg-accent px-3 py-2">
            <span className="font-mono text-[10px] font-medium text-ground">
              2 items
            </span>
            <span className="font-mono text-[10px] font-medium text-ground">
              View order · $14.50
            </span>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}
