import React, { useState } from "react";

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 1,
      title: "أفضل العروض على أحدث المنتجات",
      description: "اكتشف تشكيلتنا الواسعة من المنتجات بأسعار لا تُقاوم.",
      image: "https://plus.unsplash.com/premium_photo-1664201889922-66bc3c778c1e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      title: "تسوق بأمان وراحة",
      description: "مع خدمة التوصيل السريع والدفع عند الاستلام.",
      image: "https://images.pexels.com/photos/6214383/pexels-photo-6214383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 3,
      title: "خصومات تصل إلى 50%",
      description: "اغتنم الفرصة الآن قبل نفاد الكمية!",
      image: "https://images.pexels.com/photos/5926462/pexels-photo-5926462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="hero-slider">
      <div
        className="slide"
        style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
      >
        <div className="slide-content">
          <h1>{slides[currentIndex].title}</h1>
          <p>{slides[currentIndex].description}</p>
          <button className="shop-now-btn">تسوق الآن</button>
        </div>
      </div>

      <button className="next-btn" onClick={nextSlide}>
        &#x276F;
      </button>
      <button className="prev-btn" onClick={prevSlide}>
        &#x276E;
      </button>
    </div>
  );
};

export default HeroSlider;
