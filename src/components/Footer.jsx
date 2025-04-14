import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PolicyModal from './PolicyModal';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [activePolicyType, setActivePolicyType] = useState(null);
  
  const handleOpenPolicyModal = (policyType, e) => {
    e.preventDefault();
    setActivePolicyType(policyType);
    setIsPolicyModalOpen(true);
  };
  
  const handleClosePolicyModal = () => {
    setIsPolicyModalOpen(false);
  };
  
  return (
    <footer className="footer" id="footer">
      <div className="section-container">
        <div className="footer-content">
          <div className="footer-section">
            <a href="#" className="footer-logo">
              <img src="src/assets/logo2.png" alt="Sapar Logo" />
              <span>Sapar</span>
            </a>
            <p>
              Откройте для себя красоту Казахстана вместе с нами. 
              Безопасные и незабываемые приключения ждут вас с опытными гидами и тщательно продуманными маршрутами.
            </p>
            <div className="social-links">
              <a href="#footer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#footer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#footer" aria-label="Telegram"><i className="fab fa-telegram"></i></a>
              <a href="#footer" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Навигация</h3>
            <ul className="footer-links">
              <li><a href="#trips">Маршруты</a></li>
              <li><a href="#regions-info">Направления</a></li>
              <li><a href="#interactive-map">Карта</a></li>
              <li><a href="#faq">Частые вопросы</a></li>
              <li><a href="#tips">Советы</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Поддержка</h3>
            <ul className="footer-links">
              <li><a href="#faq">Частые вопросы</a></li>
              <li><a href="#" onClick={(e) => handleOpenPolicyModal('terms', e)}>Условия использования</a></li>
              <li><a href="#" onClick={(e) => handleOpenPolicyModal('privacy', e)}>Политика конфиденциальности</a></li>
              <li><a href="#" onClick={(e) => handleOpenPolicyModal('refund', e)}>Политика возврата</a></li>
              <li><a href="#" onClick={(e) => handleOpenPolicyModal('cookies', e)}>Cookie-файлы</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Контакты</h3>
            <ul className="footer-links contact-info">
              <li>
                <i className="fas fa-phone"></i>
                <span>+7 (777) 777-77-77</span>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <span>info@sapar.kz</span>
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>Астана, Казахстан</span>
              </li>
              <li>
                <i className="fas fa-clock"></i>
                <span>Пн-Вт: 10:00 - 12:30</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-nav">
            <a href="#trips">Маршруты</a>
            <a href="#regions-info">Направления</a>
            <a href="#interactive-map">Карта</a>
            <a href="#faq">FAQ</a>
            <a href="#tips">Советы</a>
          </div>
          <p>&copy; {currentYear} <strong>Sapar</strong>. Все права защищены.</p>
        </div>
      </div>
      
      <PolicyModal 
        isOpen={isPolicyModalOpen}
        onClose={handleClosePolicyModal}
        policyType={activePolicyType}
      />
    </footer>
  );
};

export default Footer;