import { AboutSection } from "@/components/public/landing/AboutSection";
import { FooterCTA } from "@/components/public/landing/FooterCTA";
import { GallerySection } from "@/components/public/landing/GallerySection";
import { HeroSection } from "@/components/public/landing/HeroSection";
import { KelasSection } from "@/components/public/landing/KelasSection";
import { LokasiSection } from "@/components/public/landing/LokasiSection";
import { PelatihSection } from "@/components/public/landing/PelatihSection";
import { TestimoniSection } from "@/components/public/landing/TestimoniSection";
import { WaveDivider } from "@/components/public/landing/WaveDivider";

// ISR — refresh testimonial fetch + any CMS-bound copy at most once per minute.
export const revalidate = 60;

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <WaveDivider direction="sand-to-muted" />
      <AboutSection />
      <KelasSection />
      <WaveDivider direction="sand-to-muted" />
      <PelatihSection />
      <GallerySection />
      <WaveDivider direction="muted-to-sand" />
      <TestimoniSection />
      <LokasiSection />
      <WaveDivider direction="muted-to-sand" />
      <FooterCTA />
    </>
  );
}
