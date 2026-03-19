import React, { useState, useEffect } from 'react';
import '../styles/components.css';

const ImageSlider = ({ images = [], fullHeight = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback gradients if no images are provided
  const placeholders = [
    { 
      id: 1, 
      color: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1510797215324-95aa89f297a6?auto=format&fit=crop&q=80&w=2000")', 
      title: 'NORWAY', 
      subtitle: 'EXPLORE',
      details: ['Trondheim', 'Geirangerfjord', 'Lofoten']
    },
    { 
      id: 2, 
      color: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000")', 
      title: 'DISCOVER', 
      subtitle: 'HIDDEN PLACES',
      details: ['Himalayas', 'Alps', 'Andes']
    },
    { 
      id: 3, 
      color: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000")', 
      title: 'ADVENTURE', 
      subtitle: 'START YOUR JOURNEY',
      details: ['Yosemite', 'Zion', 'Grand Canyon']
    }
  ];

  const slides = images.length > 0 ? images : placeholders;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className={`image-slider ${fullHeight ? 'full-height' : ''}`}>
      <div className="slide-container">
        {slides.map((slide, index) => {
          let position = "hidden";
          if (index === currentIndex) position = "active";
          else if (index === (currentIndex - 1 + slides.length) % slides.length) position = "prev";
          else if (index === (currentIndex + 1) % slides.length) position = "next";

          return (
            <div key={slide.id || index} className={`slide ${position}`}>
              <div 
                className="slide-bg" 
                style={{ background: slide.url ? `url(${slide.url})` : slide.color, backgroundSize: 'cover', backgroundPosition: 'center' }}
              ></div>
              <div className="glassy-overlay"></div>
              
              <div className="slide-content">
                <span className="slide-subtitle">{slide.subtitle}</span>
                <h1 className="slide-title">{slide.title}</h1>
                
                <div className="slide-details-row">
                  {slide.details?.map((detail, idx) => (
                    <div key={idx} className="glass-info-card">
                      <span className="info-label">{detail}</span>
                      <span className="info-value">Plan a trip</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="slider-controls">
        <button className="slider-btn prev" onClick={() => setCurrentIndex((currentIndex - 1 + slides.length) % slides.length)}>❮</button>
        <div className="slider-dots">
          {slides.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
        <button className="slider-btn next" onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)}>❯</button>
      </div>
    </div>
  );
};

export default ImageSlider;
