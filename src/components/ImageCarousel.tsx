import React, { useState, useEffect } from 'react';

const destinations = [
  {
    url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3",
    location: "Santorini, Greece"
  },
  {
    url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62",
    location: "Bali, Indonesia"
  },
  {
    url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
    location: "Machu Picchu, Peru"
  },
  {
    url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963",
    location: "Venice, Italy"
  }
];

export const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === destinations.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {destinations.map((destination, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={destination.url}
            alt={destination.location}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <h3 className="text-white text-2xl font-semibold">{destination.location}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};