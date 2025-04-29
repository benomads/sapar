import React, { useState } from 'react';
import ContactModal from './ContactModal';
import '../styles/FaqSection.css';
import faqData from '../data/faqData.json';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  const handleOpenContactModal = (e) => {
    e.preventDefault();
    setIsContactModalOpen(true);
  };
  
  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="section-container">
        <h2>Часто задаваемые вопросы</h2>
        <p className="section-description">
          Ответы на самые популярные вопросы о путешествиях по Казахстану
        </p>

        <div className="faq-container">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleFaq(index)}
              >
                <h3>{faq.question}</h3>
                <span className="faq-icon">
                  <i className={`fas ${activeIndex === index ? 'fa-minus' : 'fa-plus'}`}></i>
                </span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-footer">
          <p>Остались вопросы? Мы всегда готовы помочь!</p>
          <a href="#" className="btn btn-primary" onClick={handleOpenContactModal}>
            Связаться с нами
          </a>
        </div>
      </div>
      
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
      />
    </section>
  );
};

export default FAQSection; 