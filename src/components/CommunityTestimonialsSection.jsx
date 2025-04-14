import React, { useState, useRef, useEffect } from 'react';
import '../styles/CommunityTestimonialsSection.css';
import testimonials from '../data/testimonialsData.json';


const stats = [
  { number: "10K+", label: "Счастливых путешественников" },
  { number: "500+", label: "Местных гидов" },
  { number: "100+", label: "Уникальных маршрутов" },
  { number: "4.9/5", label: "Средняя оценка" }
];

const CommunityTestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  const slideWidth = 370; 
  const visibleSlides = 3;
  const maxIndex = testimonials.length - visibleSlides;

  // Auto-slide effect
  useEffect(() => {
    let interval;
    
    if (!isPaused && !isDragging) {
      interval = setInterval(() => {
        handleNextSlide();
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, isDragging, currentIndex]);


  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${currentTranslate}px)`;
    }
  }, [currentTranslate]);

  const handlePrevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      const newTranslate = -currentIndex * slideWidth + slideWidth;
      setCurrentTranslate(newTranslate);
      setPrevTranslate(newTranslate);
    } else {
      
      setCurrentIndex(maxIndex);
      const newTranslate = -maxIndex * slideWidth;
      setCurrentTranslate(newTranslate);
      setPrevTranslate(newTranslate);
    }
  };

  const handleNextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(prev => prev + 1);
      const newTranslate = -currentIndex * slideWidth - slideWidth;
      setCurrentTranslate(newTranslate);
      setPrevTranslate(newTranslate);
    } else {
      
      setCurrentIndex(0);
      setCurrentTranslate(0);
      setPrevTranslate(0);
    }
  };

  const touchStart = (e) => {
    setIsDragging(true);
    setStartPos(e.touches[0].clientX);
  };

  const touchMove = (e) => {
    if (!isDragging) return;
    const currentPosition = e.touches[0].clientX;
    const diff = currentPosition - startPos;
    setCurrentTranslate(prevTranslate + diff);
  };

  const touchEnd = () => {
    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;
    
    if (Math.abs(movedBy) > slideWidth / 3) {
      if (movedBy < 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    } else {
      // Snap back to original position if not moved enough
      setCurrentTranslate(prevTranslate);
    }
  };

  return (
    <section className="community-testimonials">
      <div className="section-container">
        <div className="section-header">
          <h2>Отзывы наших путешественников</h2>
          <p>Присоединяйтесь к тысячам путешественников, открывших для себя магию Казахстана через Sapar</p>
        </div>

        <div 
          className="testimonials-slider"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className="testimonials-track"
            ref={trackRef}
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
            style={{ transform: `translateX(${currentTranslate}px)` }}
          >
        {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`testimonial-card ${index === currentIndex || 
                          index === currentIndex + 1 || 
                          index === currentIndex + 2 ? 'active' : ''}`}
              >
                <div className="testimonial-content">
                  <p>{testimonial.content}</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-image">
                    <img src={testimonial.author.image} alt={testimonial.author.name} />
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.author.name}</h4>
                    <p>{testimonial.author.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="slider-controls">
            <button 
              className="slider-btn" 
              onClick={handlePrevSlide}
              aria-label="Предыдущий отзыв"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="slider-indicators">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <span 
                  key={index}
                  className={`indicator ${currentIndex === index ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentIndex(index);
                    const newTranslate = -index * slideWidth;
                    setCurrentTranslate(newTranslate);
                    setPrevTranslate(newTranslate);
                  }}
                ></span>
              ))}
            </div>
            <button 
              className="slider-btn" 
              onClick={handleNextSlide}
              aria-label="Следующий отзыв"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityTestimonialsSection;