import React, { useState, useEffect } from 'react';
import heroSliderImg01 from '../../../assets/images/diva-store-01.webp'
import heroSliderImg02 from '../../../assets/images/diva-store-02.webp'
import heroSliderImg03 from '../../../assets/images/diva-store-03.webp'

const slides = [
  {
    id: 1,
    image: heroSliderImg01,
    title: 'عروض خاصة على أحدث المنتجات!',
    description: 'اكتشف أحدث الإصدارات بأفضل الأسعار، تسوق الآن واستمتع بخصومات مميزة.',
  },
  {
    id: 2,
    image: heroSliderImg02,
    title: 'توصيل سريع لجميع الطلبات!',
    description: 'نوفر لك خدمة توصيل سريعة وآمنة إلى باب منزلك، أينما كنت.',
  },
  {
    id: 3,
    image: heroSliderImg03,
    title: 'تسوق بأمان وراحة!',
    description: 'نضمن لك تجربة شراء آمنة مع خيارات دفع مرنة وسهلة.',
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
    <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000020] text-white px-6">
            <h1 className="text-2xl md:text-4xl font-bold mb-6 drop-shadow-sm text-center">{slide.title}</h1>
            <p className="text-lg md:text-2xl drop-shadow-sm text-center">{slide.description}</p>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <label
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