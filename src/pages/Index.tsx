
import { useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PredictionForm from "@/components/PredictionForm";
import ResultDisplay from "@/components/ResultDisplay";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { sampleProperties } from "@/data/sampleProperties";

const Index = () => {
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handlePredictionResult = (price: number) => {
    setPredictedPrice(price);
    window.scrollTo({
      top: formRef.current ? formRef.current.offsetTop - 100 : 0,
      behavior: "smooth"
    });
  };

  const scrollToPredict = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const resetPrediction = () => {
    setPredictedPrice(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <Hero scrollToPredict={scrollToPredict} />

        <section className="py-16" ref={formRef} data-section="prediction-form">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Predict Your Property Value</h2>
              <p className="text-muted-foreground">
                Get an accurate estimate of your property's market value using our AI-powered prediction tool.
              </p>
            </div>
            
            {predictedPrice === null ? (
              <PredictionForm onPredictionResult={handlePredictionResult} />
            ) : (
              <ResultDisplay 
                predictedPrice={predictedPrice} 
                onReset={resetPrediction} 
              />
            )}
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Recent Property Valuations</h2>
              <p className="text-muted-foreground">
                Explore recent property valuations from our AI oracle in Hyderabad.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sampleProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
