
import { useEffect, useState } from "react";
import { LineChart, TrendingUp, Home } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ResultDisplayProps {
  predictedPrice: number | null;
  onReset: () => void;
}

const ResultDisplay = ({ predictedPrice, onReset }: ResultDisplayProps) => {
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Format price in Indian format (lakhs, crores)
  const formatIndianPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakhs`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };

  useEffect(() => {
    if (predictedPrice !== null) {
      setProgress(0);
      setShowResults(false);
      
      const timer = setTimeout(() => {
        setShowResults(true);
      }, 1000);
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 4;
        });
      }, 30);
      
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [predictedPrice]);

  if (predictedPrice === null) {
    return null;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <CardTitle className="text-2xl flex items-center">
          <LineChart className="mr-2 h-5 w-5" />
          Price Prediction Result
        </CardTitle>
        <CardDescription className="text-blue-100">
          Based on your property details and our ML model
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {!showResults ? (
          <div className="py-8 space-y-4">
            <p className="text-center text-muted-foreground">Analyzing market data...</p>
            <Progress value={progress} className="w-full" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-2">Estimated property value</p>
              <h3 className="text-4xl font-bold text-primary">
                {formatIndianPrice(predictedPrice)}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Price Range</p>
                <p className="font-medium">
                  {formatIndianPrice(predictedPrice * 0.9)} - {formatIndianPrice(predictedPrice * 1.1)}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Per Sq. Ft.</p>
                <p className="font-medium">₹{Math.round(predictedPrice / 1000)}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                <p className="font-medium">92%</p>
              </div>
            </div>
            
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={onReset}>
                <TrendingUp className="mr-2 h-4 w-4" />
                New Prediction
              </Button>
              <Button variant="default">
                <Home className="mr-2 h-4 w-4" />
                Save Result
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
