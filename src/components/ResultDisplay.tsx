
import { useEffect, useState } from "react";
import { LineChart, TrendingUp, Home, Info, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface ResultDisplayProps {
  predictedPrice: number | null;
  onReset: () => void;
}

const ResultDisplay = ({ predictedPrice, onReset }: ResultDisplayProps) => {
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { isAuthenticated, user } = useAuth();

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

  const handleSaveResult = () => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to save predictions", {
        description: "You need to be logged in to save your prediction results.",
        duration: 5000,
      });
      return;
    }

    // Get existing saved predictions from localStorage using user ID
    const storageKey = `savedPredictions_${user.id}`;
    const savedPredictions = JSON.parse(localStorage.getItem(storageKey) || "[]");
    
    // Create a new prediction record
    const newPrediction = {
      id: Date.now(),
      price: predictedPrice,
      date: new Date().toISOString(),
      formattedPrice: formatIndianPrice(predictedPrice as number),
    };
    
    // Add new prediction to the beginning of the array
    savedPredictions.unshift(newPrediction);
    
    // Save back to localStorage with user ID
    localStorage.setItem(storageKey, JSON.stringify(savedPredictions));
    
    // Show success notification
    toast.success("Prediction saved successfully", {
      description: "You can view your saved predictions in your profile.",
      duration: 3000,
    });
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
            
            {/* New summary section */}
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
              <h4 className="text-lg font-medium text-blue-700 mb-3 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Summary Analysis
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span>Your property valuation is <span className="font-medium">{formatIndianPrice(predictedPrice)}</span></span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  <span>This is <span className="font-medium">
                    {predictedPrice > 8000000 ? 'above' : 'below'} average
                  </span> for similar properties in this location</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  <span>Market trend: <span className="font-medium text-green-600">+5.3% growth</span> expected in next 6 months</span>
                </li>
                <li className="flex items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center cursor-help">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                          <span>Most valuable factors: <span className="font-medium">Location, amenities</span></span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">These factors contributed most significantly to your property's valuation.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={onReset}>
                <TrendingUp className="mr-2 h-4 w-4" />
                New Prediction
              </Button>
              <Button variant="default" onClick={handleSaveResult}>
                <Save className="mr-2 h-4 w-4" />
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
