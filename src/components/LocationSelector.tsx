
import React, { useState } from 'react';
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin } from 'lucide-react';
import Map from './Map';

interface LocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
}

const LocationSelector = ({ value, onChange }: LocationSelectorProps) => {
  const [showMap, setShowMap] = useState(false);

  const handleLocationSelect = (location: string) => {
    onChange(location);
    setShowMap(false);
  };

  return (
    <FormItem>
      <FormLabel>Location</FormLabel>
      <div className="relative">
        <FormControl>
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Select location"
                className="pl-9"
                readOnly
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMap(true)}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Map
            </Button>
          </div>
        </FormControl>
      </div>
      
      {showMap && (
        <Map 
          onSelectLocation={handleLocationSelect}
          onClose={() => setShowMap(false)}
        />
      )}
    </FormItem>
  );
};

export default LocationSelector;
