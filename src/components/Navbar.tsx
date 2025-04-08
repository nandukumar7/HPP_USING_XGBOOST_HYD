
import { Link } from "react-router-dom";
import { Home, LineChart, HelpCircle, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  const scrollToPredict = () => {
    const formElement = document.querySelector('[data-section="prediction-form"]');
    if (formElement) {
      formElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">HomePriceOracle</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          <Button className="hidden md:flex" onClick={scrollToPredict}>
            <LineChart className="mr-2 h-4 w-4" />
            Get Prediction
          </Button>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  <User className="h-4 w-4 mr-2" />
                  {user?.name || user?.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
