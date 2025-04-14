import React, { useState } from 'react';
import '../styles/ContactModal.css';

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    
    const botToken = '7644942189:AAHqpORfDeaWwYUtZxNSAtTBduOOh8Is4BY';
    const chatId = '1002521847512';
    
    
    const message = `
📨 Новое сообщение с сайта:

👤 Имя: ${formData.name}
📧 Email: ${formData.email}
📱 Телефон: ${formData.phone}

💬 Сообщение:
${formData.message}
    `;

    try {
      // Send the message to Telegram
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      });

      const result = await response.json();
      
      if (result.ok) {
        setSubmitStatus('success');
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <button className="contact-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="contact-modal-header">
          <h2>Связаться с нами</h2>
          <p>Заполните форму, и мы свяжемся с вами в ближайшее время</p>
        </div>
        
        {submitStatus === 'success' ? (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <h3>Сообщение отправлено!</h3>
            <p>Спасибо за обращение. Мы свяжемся с вами в ближайшее время.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Ваше имя</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Введите ваше имя"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Введите ваш email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Телефон</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Введите ваш номер телефона"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Сообщение</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Опишите ваш вопрос или запрос"
                rows="4"
              ></textarea>
            </div>
            
            {submitStatus === 'error' && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                <p>Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте снова позже.</p>
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn btn-primary submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Отправка...
                </>
              ) : 'Отправить сообщение'}
            </button>
          </form>
        )}
        
        <div className="contact-modal-footer">
          <div className="alternative-contacts">
            <p>Другие способы связи:</p>
            <div className="contact-methods">
              <div className="contact-method">
                <i className="fas fa-phone"></i>
                <span>+7 (777) 777-77-77</span>
              </div>
              <div className="contact-method">
                <i className="fas fa-envelope"></i>
                <span>info@sapar.kz</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal; 