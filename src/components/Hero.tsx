
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  scrollToPredict: () => void;
}

const Hero = ({ scrollToPredict }: HeroProps) => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Hyderabad Home Price Oracle
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Accurate property valuation powered by machine learning. Get instant 
            price predictions for homes in Hyderabad based on location, size, and amenities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={scrollToPredict} size="lg" className="gap-2">
              Get Your Prediction
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
