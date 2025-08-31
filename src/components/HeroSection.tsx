import { FlightSearchForm } from "./FlightSearchForm";
import heroImage from "@/assets/hero-aviation.jpg";

interface HeroSectionProps {
  onSearch: (flightNumber: string, date: string) => void;
  isLoading?: boolean;
}

export const HeroSection = ({ onSearch, isLoading = false }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="space-y-8 animate-fade-in">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
              Flight Delayed?
              <br />
              <span className="text-accent">Get Paid.</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Check if you're entitled to up to <strong>€600 compensation</strong> for flight delays, 
              cancellations, or overbooking. Free check, no hidden fees.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-primary-foreground/80 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">€250-€600</div>
              <div className="text-sm">EU Compensation</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">2 Minutes</div>
              <div className="text-sm">Quick Check</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent">100% Free</div>
              <div className="text-sm">No Hidden Costs</div>
            </div>
          </div>

          {/* Search Form */}
          <div className="pt-8">
            <FlightSearchForm onSearch={onSearch} isLoading={isLoading} />
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 space-y-4">
            <p className="text-sm text-primary-foreground/70">
              ✈️ Covers 500+ Airlines • 🌍 EU Regulation EC 261/2004 • ⭐ 50,000+ Claims Processed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};