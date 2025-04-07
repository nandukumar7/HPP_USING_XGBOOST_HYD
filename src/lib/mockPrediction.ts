
export interface PropertyDetails {
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

// Simple mock prediction function that calculates a property price
// based on various factors (this would be replaced by an ML model in production)
export const makePrediction = (details: PropertyDetails): number => {
  // Base price per sq ft based on location (in Hyderabad)
  const locationPrices: Record<string, number> = {
    "Banjara Hills": 12000,
    "Jubilee Hills": 13000,
    "Gachibowli": 7000,
    "Hitech City": 7500,
    "Kukatpally": 5000,
    "Madhapur": 8000,
    "Kondapur": 6500,
    "Miyapur": 4500,
  };

  // Base price based on location and area
  const basePrice = (locationPrices[details.location] || 5000) * details.area;

  // Adjustments based on property type
  const propertyTypeMultiplier: Record<string, number> = {
    "Apartment": 1.0,
    "Independent House": 1.2,
    "Villa": 1.4,
    "Penthouse": 1.6,
  };

  // Apply multipliers and adjustments
  let price = basePrice * (propertyTypeMultiplier[details.propertyType] || 1.0);

  // Adjust for bedrooms, bathrooms, and parking
  price += details.bedrooms * 500000;
  price += details.bathrooms * 300000;
  price += details.parking * 200000;

  // Add premium for amenities
  if (details.hasGarden) price *= 1.05;
  if (details.hasSecurity) price *= 1.03;
  if (details.hasPowerBackup) price *= 1.02;

  // Add some randomness to simulate ML model variations (±5%)
  const randomFactor = 0.95 + Math.random() * 0.1;
  price = Math.round(price * randomFactor);

  return price;
};
