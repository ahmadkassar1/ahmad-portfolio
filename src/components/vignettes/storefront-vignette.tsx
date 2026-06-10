import { BrowserFrame, GreekBar, MicroAction, Value } from "./bits";

const products: { w: string; price: string; featured?: boolean }[] = [
  { w: "w-12", price: "$24" },
  { w: "w-16", price: "$18", featured: true },
  { w: "w-10", price: "$32" },
  { w: "w-14", price: "$21" },
  { w: "w-12", price: "$27" },
  { w: "w-16", price: "$15" },
];

export function StorefrontVignette() {
  return (
    <BrowserFrame url="scoopadoop.shop">
      <div className="flex gap-3.5 p-3.5">
        <div className="grid flex-1 grid-cols-3 gap-2.5">
          {products.map((product, i) => (
            <div
              key={i}
              className={`rounded-lg border p-2 ${
                product.featured
                  ? "border-accent/50 bg-accent/8"
                  : "border-line bg-panel"
              }`}
            >
              <div
                aria-hidden="true"
                className="aspect-square rounded-md bg-white/8"
              />
              <div className="mt-2 space-y-1.5">
                <GreekBar w={product.w} h="h-1" />
                <div className="flex items-center justify-between">
                  <Value>{product.price}</Value>
                  {product.featured ? (
                    <MicroAction>+ Add</MicroAction>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden w-32 shrink-0 flex-col rounded-lg border border-line bg-ground/60 p-2.5 sm:flex">
          <p className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">
            Cart · 2
          </p>
          <div className="mt-2.5 space-y-2">
            {["w-16", "w-12"].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded bg-white/8" />
                <GreekBar w={w} h="h-1" />
              </div>
            ))}
          </div>
          <div className="mt-auto border-t border-line pt-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-ink-faint">Total</span>
              <Value>$42.00</Value>
            </div>
            <div className="mt-2 rounded-md bg-accent py-1.5 text-center font-mono text-[9px] font-medium text-ground">
              Checkout
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
