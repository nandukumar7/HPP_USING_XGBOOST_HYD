import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { User, LogOut, Home, History, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SavedPrediction {
  id: number;
  price: number;
  date: string;
  formattedPrice: string;
}

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [savedPredictions, setSavedPredictions] = useState<SavedPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    if (user) {
      const storageKey = `savedPredictions_${user.id}`;
      const storedPredictions = localStorage.getItem(storageKey);
      if (storedPredictions) {
        setSavedPredictions(JSON.parse(storedPredictions));
      } else {
        setSavedPredictions([]);
      }
    }
    setIsLoading(false);
  }, [isAuthenticated, navigate, user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeletePrediction = (id: number) => {
    if (!user) return;
    
    const storageKey = `savedPredictions_${user.id}`;
    const updatedPredictions = savedPredictions.filter(prediction => prediction.id !== id);
    setSavedPredictions(updatedPredictions);
    localStorage.setItem(storageKey, JSON.stringify(updatedPredictions));
    toast.success("Prediction deleted successfully");
  };

  const handleDeleteAllPredictions = () => {
    if (!user) return;
    
    const storageKey = `savedPredictions_${user.id}`;
    setSavedPredictions([]);
    localStorage.removeItem(storageKey);
    toast.success("All predictions deleted successfully");
  };

  const handleViewPrediction = (prediction: SavedPrediction) => {
    navigate("/", { state: { predictedPrice: prediction.price } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white bg-fixed">
      <Navbar />
      <main className="flex-grow pt-16 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">User Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name || user?.email}</p>
          </div>

          <Tabs defaultValue="predictions" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="predictions" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>Saved Predictions</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="predictions">
              <Card className="backdrop-blur-sm bg-white/80">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Your Saved Predictions</span>
                    {savedPredictions.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleDeleteAllPredictions}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete All
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>
                    View and manage your property predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                          <div className="space-y-2">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <div className="flex gap-2">
                            <Skeleton className="h-9 w-20" />
                            <Skeleton className="h-9 w-9" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : savedPredictions.length > 0 ? (
                    <div className="space-y-4">
                      {savedPredictions.map((prediction) => (
                        <div key={prediction.id} className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors">
                          <div>
                            <p className="font-medium">{prediction.formattedPrice}</p>
                            <p className="text-sm text-muted-foreground">Saved on {formatDate(prediction.date)}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewPrediction(prediction)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeletePrediction(prediction.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground mb-4">
                        You haven't saved any predictions yet.
                      </p>
                      <Button onClick={() => navigate("/")}>
                        <Home className="h-4 w-4 mr-2" />
                        Make a Prediction
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="backdrop-blur-sm bg-white/80">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Your account details and settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                    {user?.name && (
                      <div>
                        <p className="font-medium">Name</p>
                        <p className="text-muted-foreground">{user.name}</p>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">Account Status</p>
                      <p className="text-muted-foreground">Active</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={logout} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="backdrop-blur-sm bg-white/80">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Account settings feature coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
