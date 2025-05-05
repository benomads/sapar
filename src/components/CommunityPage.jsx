import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/CommunityPage.css';
import communityService from '../services/communityService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CommunityPage = () => {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                setLoading(true);
                const data = await communityService.getAllCommunities();
                setCommunities(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch communities:", err);
                setError("Failed to load communities. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    const filteredCommunities = activeFilter === 'all' 
        ? communities 
        : communities.filter(community => community.category === activeFilter);

    const handleJoinCommunity = async (communityId) => {
        if (!isLoggedIn) {
            toast.info("Пожалуйста, войдите в аккаунт чтобы присоединиться к сообществу");
            return;
        }
        
        try {
            await communityService.joinCommunity(communityId);
            toast.success("Вы успешно присоединились к сообществу!");
        } catch (error) {
            toast.error("Не удалось присоединиться к сообществу. Пожалуйста, попробуйте снова.");
            console.error("Error joining community:", error);
        }
    };

    return (
        <>
            <Header />
            <div className="community-page">
                <div className="community-hero">
                    <div className="hero-content">
                        <h1>Сообщества путешественников</h1>
                        <p>Присоединяйтесь к сообществам единомышленников, делитесь опытом и открывайте новые горизонты вместе!</p>
                    </div>
                </div>

                <div className="community-container">
                    <div className="filter-bar">
                        <button 
                            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >
                            Все сообщества
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'local' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('local')}
                        >
                            Локальные
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'eco' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('eco')}
                        >
                            Эко-туризм
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'photography' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('photography')}
                        >
                            Фотография
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'food' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('food')}
                        >
                            Гастрономия
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'adventure' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('adventure')}
                        >
                            Приключения
                        </button>
                        <button 
                            className={`filter-btn ${activeFilter === 'cultural' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('cultural')}
                        >
                            Культурные
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Загрузка сообществ...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <p className="error-message">{error}</p>
                            <button className="retry-btn" onClick={() => window.location.reload()}>
                                Попробовать снова
                            </button>
                        </div>
                    ) : (
                        <div className="communities-grid">
                            {filteredCommunities.length > 0 ? (
                                filteredCommunities.map(community => (
                                    <div key={community.id} className="community-card">
                                        <div className="community-image">
                                            <img 
                                                src={community.image} 
                                                alt={community.name}
                                                onError={(e) => {
                                                    e.target.src = `https://via.placeholder.com/500x300?text=${community.name.replace(/\s+/g, '+')}`;
                                                }}
                                            />
                                        </div>
                                        <div className="community-card-content">
                                            <h2>{community.name}</h2>
                                            <p className="community-location">{community.location} • Основано в {community.foundedYear}</p>
                                            <p className="community-members">{community.members} участников</p>
                                            <p className="community-description">{community.description}</p>
                                            
                                            <div className="community-events">
                                                <h3>Предстоящие события:</h3>
                                                <ul>
                                                    {community.events.map(event => (
                                                        <li key={event.id}>
                                                            <span className="event-title">{event.title}</span>
                                                            <span className="event-date">{event.date}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            
                                            <div className="social-media-links">
                                                <h3>Социальные сети:</h3>
                                                <div className="social-icons">
                                                    {community.socialMedia.facebook && (
                                                        <a href={community.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                                                            <i className="fab fa-facebook-f"></i>
                                                        </a>
                                                    )}
                                                    {community.socialMedia.instagram && (
                                                        <a href={community.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                                                            <i className="fab fa-instagram"></i>
                                                        </a>
                                                    )}
                                                    {community.socialMedia.twitter && (
                                                        <a href={community.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="social-icon twitter">
                                                            <i className="fab fa-twitter"></i>
                                                        </a>
                                                    )}
                                                    {community.socialMedia.youtube && (
                                                        <a href={community.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="social-icon youtube">
                                                            <i className="fab fa-youtube"></i>
                                                        </a>
                                                    )}
                                                    {community.socialMedia.telegram && (
                                                        <a href={community.socialMedia.telegram} target="_blank" rel="noopener noreferrer" className="social-icon telegram">
                                                            <i className="fab fa-telegram-plane"></i>
                                                        </a>
                                                    )}
                                                    {community.socialMedia.vk && (
                                                        <a href={community.socialMedia.vk} target="_blank" rel="noopener noreferrer" className="social-icon vk">
                                                            <i className="fab fa-vk"></i>
                                                        </a>
                                                    )}
                                                    {community.socialMedia.flickr && (
                                                        <a href={community.socialMedia.flickr} target="_blank" rel="noopener noreferrer" className="social-icon flickr">
                                                            <i className="fab fa-flickr"></i>
                                                        </a>
                                                    )}
                                                    {community.socialMedia.tiktok && (
                                                        <a href={community.socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="social-icon tiktok">
                                                            <i className="fab fa-tiktok"></i>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <button 
                                                className="join-btn"
                                                onClick={() => handleJoinCommunity(community.id)}
                                            >
                                                Присоединиться
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">
                                    <h3>Не найдено сообществ по выбранному фильтру</h3>
                                    <p>Попробуйте выбрать другую категорию или просмотреть все сообщества</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* <div className="create-community-section">
                        <div className="create-community-content">
                            <h2>Создайте свое сообщество</h2>
                            <p>Если вы не нашли сообщество по вашим интересам, почему бы не создать его самому? Собирайте единомышленников и отправляйтесь в путешествие вместе!</p>
                            <Link to={isLoggedIn ? "/create-community" : "/auth/login"} className="create-btn">
                                {isLoggedIn ? "Создать сообщество" : "Войдите, чтобы создать сообщество"}
                            </Link>
                        </div>
                    </div> */}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CommunityPage; 