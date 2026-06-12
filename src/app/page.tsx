import { LedgerSite } from "@/components/ledger-site";
import { OpsDeck } from "@/components/world/ops-deck";

/**
 * The ledger is passed as a server-rendered child so the full site lives
 * in the static HTML regardless of what the client-side deck decides to
 * show. OpsDeck (client) flips between ledger and world after mount.
 */
export default function Home() {
  return (
    <OpsDeck>
      <LedgerSite />
    </OpsDeck>
  );
}
