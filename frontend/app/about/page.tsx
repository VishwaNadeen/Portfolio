import AboutHero from "@/sections/about/AboutHero";
import AboutEducation from "@/sections/about/AboutEducation";
import AboutJourney from "@/sections/about/AboutJourney";
import AboutSkills from "@/sections/about/AboutSkills";
import AboutInterests from "@/sections/about/AboutInterests";
import PageTransition from "@/components/animation/PageTransition";
import FloatingCvButton from "@/sections/about/FloatingCvButton";
import ScrollToTopButton from "@/components/comon/ScrollToTopButton";
import BackgroundAnimation from "@/components/animation/BackgroundAnimation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Vishwa Nadeen",
  description: "Learn more about Vishwa Nadeen, Full Stack Developer and portfolio owner.",
  alternates: {
    canonical: "https://vishwanadeen.lk/about",
  },
};

export default function AboutPage() {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      <BackgroundAnimation />
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
      <ScrollToTopButton />
    </main>
  );
}