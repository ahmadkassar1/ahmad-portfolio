import { About } from "@/components/about";
import { Capabilities } from "@/components/capabilities";
import { Contact } from "@/components/contact";
import { DetailStrip } from "@/components/detail-strip";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { SelectedWork } from "@/components/selected-work";
import { Skills } from "@/components/skills";

/**
 * The Ledger — the complete 2D site, server-rendered. This is what SSR,
 * crawlers, reduced-motion visitors, and weak devices get; the Ops Deck
 * is layered on top of it client-side for everyone else. It must stay a
 * server component so the whole site remains in the static HTML.
 */
export function LedgerSite() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <SelectedWork />
        <DetailStrip />
        <Capabilities />
        <About />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
