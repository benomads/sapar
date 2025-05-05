import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';
import userService from '../services/userService';
import Header from './Header';
import Footer from './Footer';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        fullName: '',
        email: '',
        profilePhoto: null,
        bio: ''
    });
    const [favoriteTrips, setFavoriteTrips] = useState([]);
    const [subscribedTrips, setSubscribedTrips] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [reviewsPage, setReviewsPage] = useState(0);
    const [reviewsSize] = useState(5);
    const [reviewsTotalPages, setReviewsTotalPages] = useState(0);
    const [reviewsSort, setReviewsSort] = useState(['createdAt', 'desc']);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState('favorite');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [profileData, favoriteTripsData, subscribedTripsData] = await Promise.all([
                    userService.getProfile(),
                    userService.getFavoriteTrips(),
                    userService.getSubscribedTrips()
                ]);

                // Format the profile photo URL if needed
                let profilePhotoUrl = profileData.profileImage || null;
                if (profilePhotoUrl && profilePhotoUrl.startsWith('/uploads')) {
                    // Убедитесь, что import.meta.env.VITE_API_URL существует
                    const baseUrl = import.meta.env.VITE_API_URL ? 
                        import.meta.env.VITE_API_URL.replace('/api/v1', '') : 
                        'http://localhost:8080';
                    profilePhotoUrl = `${baseUrl}${profilePhotoUrl}`;
                }

                setUser({
                    fullName: profileData.fullName,
                    email: profileData.email,
                    profilePhoto: profilePhotoUrl,
                    bio: profileData.bio || ''
                });
                setFavoriteTrips(favoriteTripsData);
                setSubscribedTrips(subscribedTripsData);
            } catch (err) {
                setError(err.message);
                if (err.message.includes('No authentication token found')) {
                    navigate('/auth/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                setIsLoading(true);
                const response = await userService.getMyPagedReviews(
                    reviewsPage, 
                    reviewsSize, 
                    reviewsSort
                );
                setUserReviews(response.content);
                setReviewsTotalPages(response.totalPages);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserReviews();
    }, [reviewsPage, reviewsSize, reviewsSort]);

    const handleReviewSortChange = (field) => {
        const newDirection = reviewsSort[1] === 'asc' ? 'desc' : 'asc';
        setReviewsSort([field, newDirection]);
        setReviewsPage(0);
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                setIsLoading(true);
                const response = await userService.uploadProfilePhoto(file);
                setUser(prev => ({
                    ...prev,
                    profilePhoto: response.photoUrl
                }));
                setSuccessMessage('Фото профиля успешно обновлено');
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSaveProfile = async () => {
        try {
            setIsLoading(true);
            await userService.updateProfile({
                fullName: user.fullName,
                email: user.email,
                bio: user.bio
            });
            setSuccessMessage('Профиль успешно обновлен');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (isLoading && !user.fullName) {
        return (
            <>
                <Header />
                <div className="profile-loading">Загрузка...</div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="profile-page">
                <div className="profile-container">
                    <div className="profile-header">
                        <h1>Профиль пользователя</h1>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <div className="profile-content">
                        <div className="profile-section">
                            <div className="profile-photo-section">
                                <div className="profile-photo-container">
                                    {user.profilePhoto ? (
                                        <img src={user.profilePhoto} alt="Profile" className="profile-photo" />
                                    ) : (
                                        <div className="profile-photo-placeholder">
                                            <span>{user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}</span>
                                        </div>
                                    )}
                                </div>
                                <label className="photo-upload-label">
                                    Изменить фото
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="photo-upload-input"
                                    />
                                </label>
                            </div>

                            <div className="profile-info">
                                <div className="form-group">
                                    <label>Имя</label>
                                    <input
                                        type="text"
                                        value={user.fullName}
                                        onChange={(e) => setUser(prev => ({ ...prev, fullName: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>О себе</label>
                                    <textarea
                                        value={user.bio}
                                        onChange={(e) => setUser(prev => ({ ...prev, bio: e.target.value }))}
                                        rows={4}
                                        placeholder="Расскажите о себе..."
                                    />
                                </div>
                                <button 
                                    onClick={handleSaveProfile} 
                                    className="save-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                                </button>
                            </div>
                        </div>

                        <div className="trips-section">
                            <div className="tabs">
                                <button 
                                    className={`tab-button ${activeTab === 'favorite' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('favorite')}
                                >
                                    Избранные поездки
                                </button>
                                <button 
                                    className={`tab-button ${activeTab === 'subscribed' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('subscribed')}
                                >
                                    Забронированные поездки
                                </button>
                            </div>

                            {activeTab === 'favorite' && (
                                <div className="favorite-trips-section">
                                    <div className="trips-grid">
                                        {favoriteTrips.length > 0 ? (
                                            favoriteTrips.map(trip => (
                                                <div key={trip.id} className="trip-card" onClick={() => navigate(`/trip/${trip.id}`)}>
                                                    {trip.imageUrl && (
                                                        <div className="trip-card-image">
                                                            <img src={trip.imageUrl} alt={trip.title} />
                                                        </div>
                                                    )}
                                                    <h3>{trip.title}</h3>
                                                    <p className="trip-date">Дата: {formatDate(trip.date)}</p>
                                                    {trip.price && <p className="trip-price">{trip.price} ₸</p>}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-trips-message">У вас пока нет избранных поездок</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'subscribed' && (
                                <div className="subscribed-trips-section">
                                    <div className="trips-grid">
                                        {subscribedTrips.length > 0 ? (
                                            subscribedTrips.map(trip => (
                                                <div key={trip.id} className="trip-card" onClick={() => navigate(`/trip/${trip.id}`)}>
                                                    {trip.imageUrl && (
                                                        <div className="trip-card-image">
                                                            <img src={trip.imageUrl} alt={trip.title} />
                                                        </div>
                                                    )}
                                                    <h3>{trip.title}</h3>
                                                    <p className="trip-date">Дата: {formatDate(trip.date)}</p>
                                                    {trip.price && <p className="trip-price">{trip.price} ₸</p>}
                                                    <div className="booking-status">
                                                        Статус: <span className={`status-${trip.status?.toLowerCase() || 'pending'}`}>
                                                            {trip.status || 'В обработке'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-trips-message">У вас пока нет забронированных поездок</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="user-reviews-section">
                            <h2>Мои отзывы</h2>
                            {userReviews.length > 0 ? (
                                <>
                                    <div className="reviews-sort">
                                        <span>Сортировать по:</span>
                                        <button 
                                            className={`sort-button ${reviewsSort[0] === 'createdAt' ? 'active' : ''}`}
                                            onClick={() => handleReviewSortChange('createdAt')}
                                        >
                                            Дате {reviewsSort[0] === 'createdAt' && (reviewsSort[1] === 'asc' ? '▲' : '▼')}
                                        </button>
                                        <button 
                                            className={`sort-button ${reviewsSort[0] === 'rating' ? 'active' : ''}`}
                                            onClick={() => handleReviewSortChange('rating')}
                                        >
                                            Рейтингу {reviewsSort[0] === 'rating' && (reviewsSort[1] === 'asc' ? '▲' : '▼')}
                                        </button>
                                    </div>
                                    <div className="reviews-list">
                                        {userReviews.map(review => (
                                            <div key={review.id} className="review-card">
                                                <div className="review-header">
                                                    <h3 onClick={() => navigate(`/trip/${review.tripId}`)} className="review-trip-title">
                                                        {review.tripTitle}
                                                    </h3>
                                                    <div className="review-rating">
                                                        {Array.from({ length: 5 }).map((_, index) => (
                                                            <span key={index} className={`star ${index < review.rating ? 'filled' : ''}`}>★</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="review-text">{review.text}</p>
                                                <p className="review-date">Дата: {formatDate(review.createdAt)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {reviewsTotalPages > 1 && (
                                        <div className="pagination">
                                            <button 
                                                onClick={() => setReviewsPage(prev => Math.max(0, prev - 1))}
                                                disabled={reviewsPage === 0}
                                                className="pagination-button"
                                            >
                                                &laquo; Предыдущая
                                            </button>
                                            <span className="pagination-info">
                                                Страница {reviewsPage + 1} из {reviewsTotalPages}
                                            </span>
                                            <button 
                                                onClick={() => setReviewsPage(prev => Math.min(reviewsTotalPages - 1, prev + 1))}
                                                disabled={reviewsPage === reviewsTotalPages - 1}
                                                className="pagination-button"
                                            >
                                                Следующая &raquo;
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="no-trips-message">У вас пока нет отзывов</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProfilePage; 