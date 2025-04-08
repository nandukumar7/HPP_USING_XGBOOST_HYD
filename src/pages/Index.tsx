
import { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PredictionForm from "@/components/PredictionForm";
import ResultDisplay from "@/components/ResultDisplay";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { sampleProperties } from "@/data/sampleProperties";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SavedPrediction {
  id: number;
  price: number;
  date: string;
  formattedPrice: string;
}

const Index = () => {
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [savedPredictions, setSavedPredictions] = useState<SavedPrediction[]>([]);
  const { isAuthenticated } = useAuth();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const storedPredictions = localStorage.getItem("savedPredictions");
      if (storedPredictions) {
        setSavedPredictions(JSON.parse(storedPredictions));
      }
    }
  }, [isAuthenticated, predictedPrice]); // Re-fetch when predictedPrice changes (after save)

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

        {isAuthenticated && savedPredictions.length > 0 && (
          <section className="py-16 bg-blue-50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Your Saved Predictions</h2>
                <p className="text-muted-foreground">
                  Previous property valuations you've saved
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {savedPredictions.map((prediction) => (
                  <Card key={prediction.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{prediction.formattedPrice}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Saved on {formatDate(prediction.date)}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handlePredictionResult(prediction.price)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

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
