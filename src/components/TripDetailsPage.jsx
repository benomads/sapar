import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/TripDetailsPage.css';
import tripService from '../services/tripService';
import tripInteractionService from '../services/tripInteractionService';
import authService from '../services/authService';

const TripDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userReview, setUserReview] = useState(null);
    const [newRating, setNewRating] = useState(0);
    const [newReviewText, setNewReviewText] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isSubmittingSubscription, setIsSubmittingSubscription] = useState(false);
    const [editTrip, setEditTrip] = useState({
        title: '',
        description: '',
        location: '',
        duration: '',
        difficulty: 'Легкая',
        price: '',
        image: null,
        isFavorite: false,
        rating: 0,
        capacity: 10,
        requiredItems: '',
        leaderInfo: '',
        additionalInfo: ''
    });
    const [reviews, setReviews] = useState([]);
    const [editImageFile, setEditImageFile] = useState(null);

    useEffect(() => {
        // Check if user is admin and authenticated
        const currentUser = authService.getCurrentUser();
        console.log('Trip Details - Current user:', currentUser);
        console.log('Trip Details - Is admin?', authService.isAdmin());
        setIsAdmin(authService.isAdmin());
        setIsAuthenticated(authService.isAuthenticated());
        
        // Fetch trip data and user interactions
        const fetchTripData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch trip details
                const tripData = await tripService.getTripById(id);
                console.log('Trip data:', tripData);
                setTrip(tripData);
                
                // Set subscription status from the API response
                setIsSubscribed(tripData.isSubscribed || false);
                
                setEditTrip({
                    ...tripData,
                    price: String(tripData.price)
                });
                
                // Fetch comments if authenticated
                if (authService.isAuthenticated()) {
                    try {
                        const commentsData = await tripInteractionService.getComments(id);
                        setComments(commentsData);
                    } catch (err) {
                        console.error('Failed to load comments:', err);
                    }
                    
                    // Fetch user's review if it exists
                    try {
                        const userReviewData = await tripInteractionService.getUserReview(id);
                        if (userReviewData) {
                            setUserReview(userReviewData);
                            setNewRating(userReviewData.rating);
                            setNewReviewText(userReviewData.text || '');
                        }
                    } catch (err) {
                        console.error('Failed to load user review:', err);
                    }
                    
                    // Fetch all reviews
                    try {
                        const reviewsData = await tripInteractionService.getReviews(id);
                        setReviews(reviewsData);
                    } catch (err) {
                        console.error('Failed to load reviews:', err);
                    }
                }
            } catch (error) {
                setError('Не удалось загрузить информацию о поездке. Пожалуйста, попробуйте позже.');
                console.error('Error fetching trip details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTripData();
    }, [id]);

    // Handle API errors and display appropriate messages
    const handleApiError = (error, defaultMessage) => {
        console.error(error);
        if (error.message && error.message.includes('Unauthorized')) {
            setError('У вас нет прав для выполнения этого действия. Необходимы права администратора.');
        } else {
            setError(defaultMessage);
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditTrip(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImageFile(file);
            // Use URL.createObjectURL for better performance
            const imagePreviewUrl = URL.createObjectURL(file);
            setEditTrip(prev => ({
                ...prev,
                image: imagePreviewUrl
            }));
        }
    };

    const handleUpdateTrip = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!editTrip.title || !editTrip.description || !editTrip.location || 
            !editTrip.duration || !editTrip.price) {
            setError('Пожалуйста, заполните все обязательные поля');
            return;
        }

        try {
            setIsLoading(true);
            const tripData = {
                ...editTrip,
                price: Number(editTrip.price),
                // Don't send the base64 image string if we have a new file
                image: editImageFile ? null : editTrip.image
            };
            
            // First update the trip data
            const updatedTrip = await tripService.updateTrip(id, tripData);
            
            // Then, if we have a new image file, upload it separately
            if (editImageFile) {
                await tripService.uploadMainImage(updatedTrip.id, editImageFile);
                // After upload, fetch the trip again to get the updated image URL
                const refreshedTrip = await tripService.getTripById(id);
                setTrip(refreshedTrip);
            } else {
                setTrip(updatedTrip);
            }
            
            // Clear the edit state and image file
            setShowEditForm(false);
            setEditImageFile(null);
            setError('');
        } catch (err) {
            handleApiError(err, 'Не удалось обновить поездку. Пожалуйста, попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTrip = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить эту поездку?')) {
            return;
        }
        
        try {
            setIsLoading(true);
            await tripService.deleteTrip(id);
            navigate('/trips');
        } catch (err) {
            handleApiError(err, 'Не удалось удалить поездку. Пожалуйста, попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFavorite = async () => {
        try {
            if (!trip) return;
            
            // Check if user is logged in
            if (!authService.isAuthenticated()) {
                setError('Пожалуйста, войдите в систему, чтобы добавить маршрут в избранное');
                return;
            }
            
            const newFavoriteStatus = !trip.isFavorite;
            console.log(`Setting favorite status for trip ${id} to ${newFavoriteStatus}`);
            
            // Update UI immediately for better user experience (optimistic update)
            setTrip(prev => ({ ...prev, isFavorite: newFavoriteStatus }));
            
            // Now make the API call
            try {
                const result = await tripService.toggleFavorite(id, newFavoriteStatus);
                console.log(`Successfully set favorite for trip ${id} to ${newFavoriteStatus}`, result);
                
                // If the API response doesn't match what we expected, revert the UI
                if (result.isFavorite !== newFavoriteStatus) {
                    console.warn('API returned different favorite state than requested, updating UI to match');
                    setTrip(prev => ({ ...prev, isFavorite: result.isFavorite }));
                }
            } catch (apiError) {
                console.error('API error when setting favorite:', apiError);
                // Revert UI state if API call fails
                setTrip(prev => ({ ...prev, isFavorite: !newFavoriteStatus }));
                setError('Не удалось обновить избранное. Пожалуйста, попробуйте позже.');
            }
        } catch (err) {
            console.error('Error in toggleFavorite function:', err);
            handleApiError(err, 'Не удалось обновить избранное. Пожалуйста, попробуйте позже.');
        }
    };

    // New functionality for comments, reviews, and subscriptions

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        if (!newComment.trim()) {
            return;
        }
        
        if (!isAuthenticated) {
            setError('Пожалуйста, войдите в систему, чтобы оставить комментарий');
            return;
        }
        
        try {
            setIsSubmittingComment(true);
            const commentData = {
                text: newComment.trim(),
                tripId: id
            };
            
            const addedComment = await tripInteractionService.addComment(id, commentData);
            
            // Add the new comment to the list
            setComments(prev => [addedComment, ...prev]);
            setNewComment('');
            setError('');
        } catch (err) {
            handleApiError(err, 'Не удалось добавить комментарий. Пожалуйста, попробуйте позже.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleRatingChange = (value) => {
        setNewRating(value);
    };

    const handleReviewTextChange = (e) => {
        setNewReviewText(e.target.value);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        
        if (newRating === 0) {
            setError('Пожалуйста, выберите рейтинг');
            return;
        }
        
        if (!isAuthenticated) {
            setError('Пожалуйста, войдите в систему, чтобы оставить отзыв');
            return;
        }
        
        try {
            setIsSubmittingReview(true);
            const reviewData = {
                rating: newRating,
                text: newReviewText.trim() || null
            };
            
            let updatedReview;
            
            if (userReview) {
                // Update existing review
                updatedReview = await tripInteractionService.updateReview(id, userReview.id, reviewData);
            } else {
                // Create new review
                updatedReview = await tripInteractionService.submitReview(id, reviewData);
            }
            
            setUserReview(updatedReview);
            
            // Refresh all reviews
            const reviewsData = await tripInteractionService.getReviews(id);
            setReviews(reviewsData);
            
            // Update the trip's review info in the UI
            setTrip(prevTrip => ({
                ...prevTrip,
                reviewCount: prevTrip.reviewCount + (userReview ? 0 : 1),
                // In a real app, we'd get the new average from the backend
                // This is a simplified approach
                averageRating: updatedReview.rating
            }));
            
            setError('');
        } catch (err) {
            handleApiError(err, 'Не удалось сохранить отзыв. Пожалуйста, попробуйте позже.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleSubscription = async () => {
        if (!isAuthenticated) {
            setError('Пожалуйста, войдите в систему, чтобы подписаться на поездку');
            return;
        }
        
        try {
            setIsSubmittingSubscription(true);
            
            if (isSubscribed) {
                await tripInteractionService.unsubscribeFromTrip(id);
                setIsSubscribed(false);
            } else {
                await tripInteractionService.subscribeToTrip(id);
                setIsSubscribed(true);
            }
            
            setError('');
        } catch (err) {
            handleApiError(err, 'Не удалось обновить подписку. Пожалуйста, попробуйте позже.');
        } finally {
            setIsSubmittingSubscription(false);
        }
    };

    // Render stars for ratings
    const renderStars = (rating, interactive = false) => {
        return (
            <div className={`stars-container ${interactive ? 'interactive' : ''}`}>
                {[1, 2, 3, 4, 5].map(star => (
                    <span 
                        key={star} 
                        className={`star ${star <= rating ? 'filled' : ''}`}
                        onClick={() => interactive && handleRatingChange(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    // Format date for comments
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    // Get correct text based on review count
    const getReviewCountText = (count) => {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            return 'отзывов';
        }
        
        if (lastDigit === 1) {
            return 'отзыв';
        }
        
        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'отзыва';
        }
        
        return 'отзывов';
    };

    return (
        <>
            <Header />
            <div className="trip-details-page">
                <div className="trip-details-container">
                    <div className="page-header">
                        <Link to="/trips" className="back-button">
                            ← Назад к маршрутам
                        </Link>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loader"></div>
                            <p>Загрузка информации о поездке...</p>
                        </div>
                    ) : trip ? (
                        <>
                            {!showEditForm ? (
                                <>
                                    <div className="trip-details">
                                        <div className="trip-header">
                                            <h1>{trip.title}</h1>
                                        </div>
                                        
                                        <div className="trip-image-container">
                                            <img src={trip.image} alt={trip.title} />
                                        </div>
                                        
                                        <div className="trip-actions-bar">
                                            <button 
                                                className={`favorite-btn ${trip.isFavorite ? 'active' : ''}`}
                                                onClick={toggleFavorite}
                                            >
                                                <i className={`fas ${trip.isFavorite ? 'fa-heart' : 'fa-heart'}`}></i>
                                                {trip.isFavorite ? 'В избранном' : 'В избранное'}
                                            </button>
                                            
                                            {/* {isAuthenticated && (
                                                <button
                                                    className={`subscribe-btn ${isSubscribed ? 'unsubscribe' : ''}`}
                                                    onClick={handleSubscription}
                                                    disabled={isSubmittingSubscription}
                                                >
                                                    {isSubmittingSubscription 
                                                        ? 'Загрузка...' 
                                                        : isSubscribed 
                                                            ? 'Отписаться' 
                                                            : 'Подписаться на обновления'}
                                                </button>
                                            )} */}
                                            
                                            {isAdmin && (
                                                <div className="admin-actions">
                                                    <button 
                                                        className="edit-btn"
                                                        onClick={() => setShowEditForm(true)}
                                                    >
                                                        <i className="fas fa-edit"></i> Редактировать
                                                    </button>
                                                    <button 
                                                        className="delete-btn"
                                                        onClick={deleteTrip}
                                                    >
                                                        <i className="fas fa-trash"></i> Удалить
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="trip-meta">
                                            <div className="meta-item">
                                                <div className="meta-label">Локация</div>
                                                <div className="meta-value">{trip.location}</div>
                                            </div>
                                            <div className="meta-item">
                                                <div className="meta-label">Длительность</div>
                                                <div className="meta-value">{trip.duration}</div>
                                            </div>
                                            <div className="meta-item">
                                                <div className="meta-label">Сложность</div>
                                                <div className="meta-value">{trip.difficulty}</div>
                                            </div>
                                            <div className="meta-item">
                                                <div className="meta-label">Стоимость</div>
                                                <div className="meta-value">{trip.price} тг</div>
                                            </div>
                                            <div className="meta-item">
                                                <div className="meta-label">Вместимость</div>
                                                <div className="meta-value">{trip.capacity || '10'} человек</div>
                                            </div>
                                            <div className="meta-item rating">
                                                <div className="meta-label">Рейтинг</div>
                                                <div className="meta-value">
                                                    {renderStars(trip.averageRating || trip.rating || 0)} 
                                                    ({trip.reviewCount || 0} {getReviewCountText(trip.reviewCount || 0)})
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="trip-description">
                                            <h2>Описание</h2>
                                            <p>{trip.description}</p>
                                        </div>
                                        
                                        {/* New sections for additional trip details */}
                                        <div className="trip-required-items">
                                            <h2>Что взять с собой</h2>
                                            {trip.requiredItems ? (
                                                <div className="required-items-content">
                                                    <p>{trip.requiredItems}</p>
                                                </div>
                                            ) : (
                                                <p className="no-data">Информация не указана</p>
                                            )}
                                        </div>
                                        
                                        <div className="trip-leader-info">
                                            <h2>Руководитель группы</h2>
                                            {trip.leaderInfo ? (
                                                <div className="leader-info-content">
                                                    <div className="leader-details">
                                                        {trip.leaderImage && (
                                                            <div className="leader-image">
                                                                <img src={trip.leaderImage} alt="Руководитель группы" />
                                                            </div>
                                                        )}
                                                        <div className="leader-bio">
                                                            <p>{trip.leaderInfo}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="no-data">Информация о руководителе не указана</p>
                                            )}
                                        </div>
                                        
                                        {trip.additionalInfo && (
                                            <div className="trip-additional-info">
                                                <h2>Дополнительная информация</h2>
                                                <div className="additional-info-content">
                                                    <p>{trip.additionalInfo}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="book-trip-section">
                                            <button className="book-btn" onClick={handleSubscription}disabled={isSubmittingSubscription}
                                                >
                                                    {isSubmittingSubscription 
                                                        ? 'Загрузка...' 
                                                        : isSubscribed 
                                                            ? 'Отписаться' 
                                                            : 'Забронировать путешествие'}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Review Section */}
                                    <div className="trip-review-section">
                                        <h2>Оставить отзыв</h2>
                                        {!isAuthenticated ? (
                                            <div className="auth-prompt">
                                                <p>Чтобы оставить отзыв, необходимо <Link to="/auth/login">войти</Link> в систему</p>
                                            </div>
                                        ) : (
                                            <form className="review-form" onSubmit={handleReviewSubmit}>
                                                <div className="rating-input">
                                                    <label>Ваша оценка:</label>
                                                    {renderStars(newRating, true)}
                                                </div>
                                                
                                                <div className="form-group">
                                                    <label htmlFor="reviewText">Ваш отзыв (необязательно):</label>
                                                    <textarea 
                                                        id="reviewText"
                                                        value={newReviewText}
                                                        onChange={handleReviewTextChange}
                                                        placeholder="Расскажите о своих впечатлениях..."
                                                        rows={4}
                                                    ></textarea>
                                                </div>
                                                
                                                <button 
                                                    type="submit" 
                                                    className="submit-review-btn"
                                                    disabled={isSubmittingReview || newRating === 0}
                                                >
                                                    {isSubmittingReview 
                                                        ? 'Отправка...' 
                                                        : userReview 
                                                            ? 'Обновить отзыв' 
                                                            : 'Отправить отзыв'}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                    
                                    {/* Comments Section */}
                                    <div className="trip-comments-section">
                                        <h2>Комментарии</h2>
                                        
                                        {isAuthenticated ? (
                                            <form className="comment-form" onSubmit={handleCommentSubmit}>
                                                <div className="form-group">
                                                    <textarea 
                                                        value={newComment}
                                                        onChange={handleCommentChange}
                                                        placeholder="Напишите свой комментарий..."
                                                        rows={3}
                                                        required
                                                    ></textarea>
                                                </div>
                                                
                                                <button 
                                                    type="submit" 
                                                    className="submit-comment-btn"
                                                    disabled={isSubmittingComment || !newComment.trim()}
                                                >
                                                    {isSubmittingComment ? 'Отправка...' : 'Отправить комментарий'}
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="auth-prompt">
                                                <p>Чтобы оставить комментарий, необходимо <Link to="/auth/login">войти</Link> в систему</p>
                                            </div>
                                        )}
                                        
                                        <div className="comments-list">
                                            {comments.length === 0 ? (
                                                <p className="no-comments">Будьте первым, кто оставит комментарий!</p>
                                            ) : (
                                                comments.map(comment => (
                                                    <div className="comment" key={comment.id}>
                                                        <div className="comment-header">
                                                            <span className="comment-author">{comment.userName || 'Анонимный пользователь'}</span>
                                                            <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                                        </div>
                                                        <p className="comment-text">{comment.text}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="edit-trip-form">
                                    <h2>Редактирование маршрута</h2>
                                    {error && <div className="error-message">{error}</div>}
                                    <form onSubmit={handleUpdateTrip}>
                                        <div className="form-group">
                                            <label htmlFor="title">Название маршрута *</label>
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={editTrip.title}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description">Описание *</label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={editTrip.description}
                                                onChange={handleEditInputChange}
                                                required
                                                rows="5"
                                            ></textarea>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="location">Локация *</label>
                                                <input
                                                    type="text"
                                                    id="location"
                                                    name="location"
                                                    value={editTrip.location}
                                                    onChange={handleEditInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="duration">Длительность *</label>
                                                <input
                                                    type="text"
                                                    id="duration"
                                                    name="duration"
                                                    value={editTrip.duration}
                                                    onChange={handleEditInputChange}
                                                    required
                                                    placeholder="Например: 3 дня"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="difficulty">Сложность *</label>
                                                <select
                                                    id="difficulty"
                                                    name="difficulty"
                                                    value={editTrip.difficulty}
                                                    onChange={handleEditInputChange}
                                                    required
                                                >
                                                    <option value="Легкая">Легкая</option>
                                                    <option value="Средняя">Средняя</option>
                                                    <option value="Сложная">Сложная</option>
                                                    <option value="Экстремальная">Экстремальная</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="price">Стоимость (тг) *</label>
                                                <input
                                                    type="number"
                                                    id="price"
                                                    name="price"
                                                    value={editTrip.price}
                                                    onChange={handleEditInputChange}
                                                    required
                                                    min="0"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="capacity">Максимальное количество человек</label>
                                                <input
                                                    type="number"
                                                    id="capacity"
                                                    name="capacity"
                                                    value={editTrip.capacity || 10}
                                                    onChange={handleEditInputChange}
                                                    min="1"
                                                    max="100"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="image">Изображение маршрута</label>
                                            <input
                                                type="file"
                                                id="image"
                                                name="image"
                                                onChange={handleEditImageChange}
                                                accept="image/*"
                                            />
                                            {editTrip.image && (
                                                <div className="image-preview">
                                                    <img src={editTrip.image} alt="Preview" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="requiredItems">Что взять с собой</label>
                                            <textarea
                                                id="requiredItems"
                                                name="requiredItems"
                                                value={editTrip.requiredItems || ''}
                                                onChange={handleEditInputChange}
                                                rows="4"
                                                placeholder="Перечислите необходимые предметы, экипировку и т.д."
                                            ></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="leaderInfo">Информация о руководителе</label>
                                            <textarea
                                                id="leaderInfo"
                                                name="leaderInfo"
                                                value={editTrip.leaderInfo || ''}
                                                onChange={handleEditInputChange}
                                                rows="4"
                                                placeholder="Опишите руководителя группы, его опыт и квалификацию"
                                            ></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="additionalInfo">Дополнительная информация</label>
                                            <textarea
                                                id="additionalInfo"
                                                name="additionalInfo"
                                                value={editTrip.additionalInfo || ''}
                                                onChange={handleEditInputChange}
                                                rows="4"
                                                placeholder="Любая дополнительная информация, которая может быть полезна участникам"
                                            ></textarea>
                                        </div>
                                        <div className="form-actions">
                                            <button
                                                type="button"
                                                className="cancel-btn"
                                                onClick={() => setShowEditForm(false)}
                                            >
                                                Отмена
                                            </button>
                                            <button
                                                type="submit"
                                                className="submit-btn"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="not-found">
                            <h2>Маршрут не найден</h2>
                            <p>Запрашиваемый маршрут не существует или был удален.</p>
                            <Link to="/trips" className="back-link">Вернуться к списку маршрутов</Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TripDetailsPage; 