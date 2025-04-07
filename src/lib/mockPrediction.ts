
interface PropertyDetails {
  location: string;
  propertyType: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  hasGarden: boolean;
  hasSecurity: boolean;
  hasPowerBackup: boolean;
}

// This is a mock prediction function that simulates ML model predictions
// In a real app, this would be replaced with actual API calls to a backend
export const makePrediction = (details: PropertyDetails): number => {
  // Base price per sq ft based on location
  const locationPrices: Record<string, number> = {
    "Gachibowli": 7500,
    "Hitech City": 8000,
    "Kukatpally": 5500,
    "Banjara Hills": 12000,
    "Madhapur": 7800,
    "Kondapur": 6800,
    "Miyapur": 5200,
    "": 6000 // default
  };

  // Property type multipliers
  const propertyTypeMultipliers: Record<string, number> = {
    "Apartment": 1.0,
    "Independent House": 1.2,
    "Villa": 1.5,
    "Penthouse": 1.8,
    "": 1.0 // default
  };

  // Base calculation
  let basePrice = (locationPrices[details.location] || 6000) * details.area;
  
  // Apply property type multiplier
  basePrice *= propertyTypeMultipliers[details.propertyType] || 1.0;
  
  // Adjustments for bedrooms and bathrooms
  basePrice += (details.bedrooms * 200000);
  basePrice += (details.bathrooms * 150000);
  
  // Adjustments for parking
  basePrice += (details.parking * 300000);
  
  // Amenity adjustments
  if (details.hasGarden) basePrice *= 1.1;
  if (details.hasSecurity) basePrice *= 1.05;
  if (details.hasPowerBackup) basePrice *= 1.03;
  
  // Add some randomness to make predictions feel more realistic
  const randomFactor = 0.9 + Math.random() * 0.2; // Random factor between 0.9 and 1.1
  basePrice *= randomFactor;
  
  // Round to nearest 10000
  return Math.round(basePrice / 10000) * 10000;
};
