import CinematicHero from "@/components/ui/cinematic-landing-hero";
import CyberneticBentoGrid from "@/components/ui/cybernetic-bento-grid";
import Features from "@/components/sections/Features";
import Offer from "@/components/sections/Offer";
import WhyMe from "@/components/sections/WhyMe";
import FAQ from "@/components/sections/FAQ";
import CTAFooter from "@/components/sections/CTAFooter";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <CinematicHero />
      <CyberneticBentoGrid />
      <Features />
      <Offer />
      <WhyMe />
      <FAQ />
      <CTAFooter />
      <WhatsAppButton />
    </main>
  );
}
