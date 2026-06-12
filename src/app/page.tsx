import Navbar from "@/components/ui/Navbar";
import HeroProcess from "@/components/sections/HeroProcess";
import Statement from "@/components/sections/Statement";
import FeatureColumns from "@/components/sections/FeatureColumns";
import Showcase from "@/components/sections/Showcase";
import Portfolio from "@/components/sections/Portfolio";
import Offer from "@/components/sections/Offer";
import FAQ from "@/components/sections/FAQ";
import CTAFooter from "@/components/sections/CTAFooter";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CursorGlow from "@/components/ui/CursorGlow";
import ScrollProgress from "@/components/ui/ScrollProgress";

export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <CursorGlow />
      <ScrollProgress />
      <Navbar />
      <HeroProcess />
      <Statement />
      <FeatureColumns />
      <Showcase />
      <Portfolio />
      <Offer />
      <FAQ />
      <CTAFooter />
      <WhatsAppButton />
    </main>
  );
}
