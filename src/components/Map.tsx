
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

// Hyderabad coordinates
const HYDERABAD_CENTER = [78.4867, 17.3850];
const HYDERABAD_BOUNDS = [
  [78.2426, 17.1880], // Southwest coordinates
  [78.6926, 17.5720]  // Northeast coordinates
];

// Known locations in Hyderabad
const KNOWN_LOCATIONS = [
  { name: 'Gachibowli', coordinates: [78.3609, 17.4400] },
  { name: 'Hitech City', coordinates: [78.3839, 17.4477] },
  { name: 'Kukatpally', coordinates: [78.4311, 17.4949] },
  { name: 'Banjara Hills', coordinates: [78.4400, 17.4156] },
  { name: 'Madhapur', coordinates: [78.3871, 17.4534] },
  { name: 'Kondapur', coordinates: [78.3568, 17.4640] },
  { name: 'Miyapur', coordinates: [78.3522, 17.4928] },
  { name: 'Jubilee Hills', coordinates: [78.4076, 17.4314] },
  { name: 'Begumpet', coordinates: [78.4670, 17.4448] },
  { name: 'Ameerpet', coordinates: [78.4483, 17.4374] }
];

interface MapProps {
  onSelectLocation: (location: string) => void;
  onClose: () => void;
}

const Map = ({ onSelectLocation, onClose }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // You would need to replace this with your own Mapbox token in a real app
    // For now, we'll use a placeholder that will work in development
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbG45dm5nN2wwZWUyMmtvMWV5NGF1MzN6In0.1sDANY24RcjTCIKy-aQjLQ';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: HYDERABAD_CENTER,
      zoom: 11,
      maxBounds: HYDERABAD_BOUNDS
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add locations as markers
      KNOWN_LOCATIONS.forEach(location => {
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'location-marker';
        markerEl.style.width = '15px';
        markerEl.style.height = '15px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.backgroundColor = '#3b82f6';
        markerEl.style.border = '2px solid white';
        markerEl.style.cursor = 'pointer';
        
        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3 class="text-sm font-medium">${location.name}</h3>`);
        
        // Create and add marker
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat(location.coordinates as [number, number])
          .setPopup(popup)
          .addTo(map.current!);
        
        // Add click event
        markerEl.addEventListener('click', () => {
          onSelectLocation(location.name);
        });
        
        markers.current.push(marker);
      });
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [onSelectLocation]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-3xl h-[70vh] bg-white rounded-lg shadow-xl">
        <div className="absolute top-2 right-2 z-10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 pb-0">
          <h2 className="text-xl font-bold">Select Location in Hyderabad</h2>
          <p className="text-sm text-muted-foreground">Click on a marker to select a location</p>
        </div>
        <div ref={mapContainer} className="w-full h-[calc(100%-60px)] m-2 rounded-lg overflow-hidden" />
        <style jsx>{`
          .mapboxgl-popup-content {
            padding: 12px;
            border-radius: 8px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Map;
