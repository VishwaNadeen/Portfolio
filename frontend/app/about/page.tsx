import AboutHero from "@/components/about/AboutHero";
import AboutEducation from "@/components/about/AboutEducation";
import AboutJourney from "@/components/about/AboutJourney";
import AboutSkills from "@/components/about/AboutSkills";
import AboutInterests from "@/components/about/AboutInterests";
import PageTransition from "@/components/PageTransition";
import FloatingCvButton from "@/components/about/FloatingCvButton";
import ScrollToTop from "@/components/about/ScrollToTop";

export default function AboutPage() {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <PageTransition>
        <main>
          <div className="relative z-10 mx-auto max-w-5xl space-y-10 px-4 py-8 sm:space-y-12 sm:py-10 md:py-12">
            <AboutHero />
            <AboutEducation />
            <AboutJourney />
            <AboutSkills />
            <AboutInterests />
          </div>
        </main>
      </PageTransition>

      <FloatingCvButton />
      <ScrollToTop />
    </main>
  );
}