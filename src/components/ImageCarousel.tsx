import React, { useState, useEffect } from 'react';

import '../index.scss'
import { designRecipes } from 'hostApp/designRecipes';

const destinations = [
  {
    url: "https://plus.unsplash.com/premium_photo-1694542947673-9e1c61387343?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Macchu Picchu, Peru"
  },
  {
    url: "https://images.unsplash.com/photo-1523617613878-90b8be6ed7a0?q=80&w=1867&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Edinburgh, Scotland"
  }
];

const ImageCarousel = () => {
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
    <div className={`${designRecipes.panel} relative h-full w-full overflow-hidden border-0 shadow-none`}>
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ds-text-primary/70 to-transparent p-6">
            <h3 className="text-white text-2xl font-semibold">{destination.location}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageCarousel;