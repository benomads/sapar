import React, { useState, useEffect } from 'react';
import '../styles/ContactModal.css';
import contactService from '../services/contactService';

const ContactModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            setSubmitSuccess(false);
            setSubmitError('');
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        
        try {
            // Send message to Telegram
            await contactService.sendMessageToTelegram(formData);
            
            setSubmitSuccess(true);
        } catch (error) {
            setSubmitError(error.message || 'Failed to send your message. Please try again later.');
            console.error('Error sending contact form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={onClose}>×</button>
                <h2>Свяжитесь с нами</h2>
                
                {submitSuccess ? (
                    <div className="success-message">
                        <h3>Спасибо за ваше сообщение!</h3>
                        <p>Мы получили ваш запрос и свяжемся с вами в ближайшее время.</p>
                        <button 
                            className="new-message-btn"
                            onClick={() => setSubmitSuccess(false)}
                        >
                            Отправить еще сообщение
                        </button>
                        <button 
                            className="close-btn"
                            onClick={onClose}
                        >
                            Закрыть
                        </button>
                    </div>
                ) : (
                    <form className="contact-form" onSubmit={handleSubmit}>
                        {submitError && <div className="error-message">{submitError}</div>}
                        <div className="form-group">
                            <label htmlFor="modal-name">Ваше имя *</label>
                            <input 
                                type="text"
                                id="modal-name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="modal-email">Email *</label>
                            <input 
                                type="email"
                                id="modal-email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="modal-subject">Тема</label>
                            <input 
                                type="text"
                                id="modal-subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="modal-message">Сообщение *</label>
                            <textarea
                                id="modal-message"
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <div className="form-note">
                            <p>* Отправляя форму, вы соглашаетесь с политикой конфиденциальности и обработкой персональных данных</p>
                        </div>
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Отмена
                            </button>
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactModal; 