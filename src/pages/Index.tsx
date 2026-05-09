import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WalletBanner from "@/components/WalletBanner";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Comparison from "@/components/Comparison";
import Roadmap from "@/components/Roadmap";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <WalletBanner />
      <HowItWorks />
      <Features />
      <Comparison />
      <Roadmap />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
