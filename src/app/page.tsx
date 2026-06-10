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

export default function Home() {
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
