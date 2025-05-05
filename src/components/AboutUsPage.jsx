import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/AboutUsPage.css';
import contactService from '../services/contactService';

const AboutUsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

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
            // Send message to Telegram using the contactService
            await contactService.sendMessageToTelegram(formData);
            
            setSubmitSuccess(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            setSubmitError(error.message || 'Failed to send your message. Please try again later.');
            console.error('Error sending contact form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <div className="about-us-page">
                <div className="about-us-container">
                    <section className="about-section">
                        <h1>О нас</h1>
                        <div className="about-content">
                            <div className="about-image">
                                <img src="src\assets\velo-poster.jpg" alt="Sapar" 
                                     onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=Sapar'} />
                            </div>
                            <div className="about-text">
                                <h2>Наша миссия</h2>
                                <p>
                                    "Sapar" (в переводе с казахского "Путешествие") - это веб-приложение, разработанное для поддержки 
                                    пешего туризма и экотуризма в Казахстане. Наша платформа помогает путешественникам открывать, 
                                    планировать и делиться маршрутами по всей стране, с акцентом на устойчивый туризм и доступность.
                                </p>
                                <h2>О проекте</h2>
                                <p>
                                    Этот университетский проект разработал веб-приложение "Sapar" как инновационное цифровое решение 
                                    для растущего сообщества любителей пешего туризма и экотуризма в Казахстане. Мы стремимся сделать
                                    путешествия по Казахстану более доступными, безопасными и увлекательными для всех.
                                </p>
                                <h2>Наши ценности</h2>
                                <ul>
                                    <li><strong>Доступность:</strong> Мы стремимся сделать путешествия доступными для каждого</li>
                                    <li><strong>Безопасность:</strong> Безопасность наших путешественников – наш главный приоритет</li>
                                    <li><strong>Устойчивое развитие:</strong> Мы практикуем принципы экологичного туризма</li>
                                    <li><strong>Аутентичность:</strong> Мы раскрываем уникальную культуру и традиции каждого региона</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="team-section">
                        <h2>Команда</h2>
                        <div className="team-members">
                            <div className="team-member">
                                <div className="member-photo">
                                    <img src="src\assets\rengoku.jpg" alt="Yeginbay_Akzhol"
                                         onError={(e) => e.target.src = 'https://via.placeholder.com/200x200?text=A.Y'} />
                                </div>
                                <h3>Yeginbay Akzhol</h3>
                                <p className="member-position">Основатель и главный разработчик</p>
                                <p className="member-bio">Увлеченный разработчик и путешественник, создатель Sapar. Работает над развитием экотуризма в Казахстане.</p>
                                <div className="member-social">
                                    <a href="https://www.linkedin.com/in/akzhol-yeginbay/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                    <a href="https://github.com/benomads" target="_blank" rel="noopener noreferrer">GitHub</a>
                                    <a href="https://t.me/benomads" target="_blank" rel="noopener noreferrer">Telegram</a>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="contact-section" id="contact">
                        <h2>Свяжитесь с нами</h2>
                        <div className="contact-container">
                            <div className="contact-info">
                                <div className="info-item">
                                    <h3>Адрес</h3>
                                    <p>пр. Абая 52В, Алматы, Казахстан</p>
                                </div>
                                <div className="info-item">
                                    <h3>Email</h3>
                                    <p>info@sapar.kz</p>
                                </div>
                                <div className="info-item">
                                    <h3>Телефон</h3>
                                    <p>+7 (727) 123-45-67</p>
                                </div>
                                <div className="info-item">
                                    <h3>Часы работы</h3>
                                    <p>Пн-Пт: 9:00 - 18:00<br />Сб: 10:00 - 15:00</p>
                                </div>
                            
                            </div>
                            <div className="contact-form-container">
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
                                    </div>
                                ) : (
                                    <form className="contact-form" onSubmit={handleSubmit}>
                                        {submitError && <div className="error-message">{submitError}</div>}
                                        <div className="form-group">
                                            <label htmlFor="name">Ваше имя *</label>
                                            <input 
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email *</label>
                                            <input 
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="subject">Тема</label>
                                            <input 
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="message">Сообщение *</label>
                                            <textarea
                                                id="message"
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
                                        <button 
                                            type="submit" 
                                            className="submit-btn"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AboutUsPage; 