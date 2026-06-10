import { About } from "@/components/about";
import { Contact } from "@/components/contact";
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
        <Experience />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
