
import { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PredictionForm from "@/components/PredictionForm";
import ResultDisplay from "@/components/ResultDisplay";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SavedPrediction {
  id: number;
  price: number;
  date: string;
  formattedPrice: string;
}

const Index = () => {
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [savedPredictions, setSavedPredictions] = useState<SavedPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      const storedPredictions = localStorage.getItem("savedPredictions");
      if (storedPredictions) {
        setSavedPredictions(JSON.parse(storedPredictions));
      }
      setIsLoading(false);
    } else {
      setSavedPredictions([]);
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

        {isAuthenticated && (
          <section className="py-16 bg-blue-50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Your Saved Predictions</h2>
                <p className="text-muted-foreground">
                  Previous property valuations you've saved
                </p>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-8 w-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : savedPredictions.length > 0 ? (
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
              ) : (
                <div className="text-center py-10 max-w-md mx-auto">
                  <p className="text-muted-foreground mb-4">
                    You haven't saved any predictions yet. Make a prediction and save it to see it here.
                  </p>
                  <Button onClick={scrollToPredict}>Make a Prediction</Button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
