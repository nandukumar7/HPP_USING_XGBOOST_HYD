
import { Link } from "react-router-dom";
import { Home, LineChart, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
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
          <Button className="hidden md:flex">
            <LineChart className="mr-2 h-4 w-4" />
            Get Prediction
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
