import React, { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    image: 'https://img.freepik.com/free-photo/computer-mouse-paper-bag-blue-background-top-view_169016-43756.jpg?t=st=1740239789~exp=1740243389~hmac=dae3f01f050c1e9e0fc60a89be699f0f9a86dde39dbc4aee6e3575d02c25a426&w=1380',
    title: 'Slide 1',
    description: 'This is the first slide.',
  },
  {
    id: 2,
    image: 'https://img.freepik.com/free-photo/computer-mouse-green-background-isolated-flat-lay_169016-26573.jpg?t=st=1740239892~exp=1740243492~hmac=68451a2620cc4467316375daa690415b37f52c3488acfcdced4620e02f08da66&w=1380',
    title: 'Slide 2',
    description: 'This is the second slide.',
  },
  {
    id: 3,
    image: 'https://img.freepik.com/free-photo/top-view-blue-computer-mouse-with-yellow-background_23-2148226814.jpg?t=st=1740239913~exp=1740243513~hmac=fcb1c5f97b884e24967a936c9e3a6e7dd6cfee28160e99fc61c97c7e7ce05b65&w=1380',
    title: 'Slide 3',
    description: 'This is the third slide.',
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000); // Auto slide every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000020] text-white">
            <h2 className="text-4xl font-bold">{slide.title}</h2>
            <p className="text-xl">{slide.description}</p>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l"
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;