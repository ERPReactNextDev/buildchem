import { Hero } from "@/components/homepage/hero";
import { LogoSection } from "@/components/homepage/logo-section";
import { SolutionsSection } from "@/components/homepage/solutions-section";
import { ReelsSection } from "@/components/homepage/reels-section";
import { FaqSection } from "@/components/homepage/faq-section";
import { CtaSection } from "@/components/homepage/cta-section";
import { Footer } from "@/components/homepage/footer";
import { AboutSection } from "@/components/homepage/about-section";
import Navbar from "@/components/homepage/nav";
import { ServicesSection } from "@/components/homepage/services-section";
import { KeyProjectsSection } from "@/components/homepage/key-projects-section";
import AnnouncementBar from "@/components/homepage/announcement-bar"; // ✅ Bago

export default function Home() {
  return (
    <>
      <Navbar />
      <AnnouncementBar />
      <main>
        <Hero />
        <LogoSection />
        <AboutSection />
        <KeyProjectsSection />
        <ServicesSection />
        <SolutionsSection />
        <ReelsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}