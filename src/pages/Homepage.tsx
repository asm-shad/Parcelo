// Homepage.tsx
import HeroSection from "@/components/modules/HomePage/HeroSection";
import { About } from "./About";
import { FeaturesPage } from "./FeaturesPage";

export default function Homepage() {
  return (
    <div>
      {/* Hero section should be full-width */}
      <HeroSection />

      {/* Other content can be in container */}
      <div className="container mx-auto py-12">
        <About></About>
        <FeaturesPage></FeaturesPage>
      </div>
    </div>
  );
}
