
import { useEffect, useState } from 'react';

const ScrollingBackground = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Array of real estate/property related background images
  const bgImages = [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Modern building
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Luxury home
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Property interior
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Modern house
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Hyderabad cityscape
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Background image rotation effect
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 8000); // Change image every 8 seconds

    // Scroll effect handlers
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(imageInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [bgImages.length]);

  // Calculate parallax effect based on scroll position
  const calculateParallax = (index: number) => {
    // Different speeds for different layers
    const speed = index === currentImageIndex ? 0.3 : 0.5;
    return `translateY(${scrollPosition * speed}px)`;
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {bgImages.map((image, index) => (
        <div 
          key={index}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1500"
          style={{
            backgroundImage: `url(${image})`,
            opacity: index === currentImageIndex ? 1 : 0,
            transform: calculateParallax(index),
          }}
        />
      ))}
      {/* Overlay to ensure content remains readable */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-white/90 to-white/80 backdrop-blur-sm"
        style={{ transform: `translateY(${scrollPosition * 0.1}px)` }}
      />
    </div>
  );
};

export default ScrollingBackground;
