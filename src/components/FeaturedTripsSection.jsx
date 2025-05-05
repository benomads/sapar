import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/FeaturedTripsSection.css';
import tripService from '../services/tripService';

const FeaturedTripsSection = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const fetchedTrips = await tripService.getAllTrips();
        
        // Get only 6 trips maximum for featured section
        const featuredTrips = fetchedTrips.slice(0, 6);
        setTrips(featuredTrips);
        setError(null);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to load trips. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrips();
    
    // Load saved favorites
    const savedFavorites = localStorage.getItem('tripFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  

  useEffect(() => {
    localStorage.setItem('tripFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = async (id, e) => {
    // Prevent navigating to trip details when clicking the favorite button
    e.stopPropagation();
    
    try {
      const isFavorite = !favorites.includes(id);
      
      // Update UI immediately for better user experience
      if (isFavorite) {
        setFavorites([...favorites, id]);
      } else {
        setFavorites(favorites.filter(favId => favId !== id));
      }
      
      // Call API to update favorite status
      await tripService.toggleFavorite(id, isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Revert on error
      if (favorites.includes(id)) {
        setFavorites(favorites.filter(favId => favId !== id));
      } else {
        setFavorites([...favorites, id]);
      }
    }
  };
  
  const filteredTrips = activeFilter === 'favorites' 
    ? trips.filter(trip => favorites.includes(trip.id))
    : trips;
    
  const handleTripClick = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  if (isLoading) {
    return (
      <section className="featured-trips" id='trips'>
        <div className="section-container">
          <h2>Популярные приключения</h2>
          <p className="section-description">Загрузка маршрутов...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-trips" id='trips'>
        <div className="section-container">
          <h2>Популярные приключения</h2>
          <p className="section-description error">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-trips" id='trips'>
      <div className="section-container">
        <h2>Популярные приключения</h2>
        <p className="section-description">
          Откройте для себя наши самые популярные маршруты, тщательно отобранные для незабываемых впечатлений
        </p>
        
       
        <div className="trips-filter">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Все маршруты
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveFilter('favorites')}
          >
            Избранное
            {favorites.length > 0 && <span className="favorites-count">{favorites.length}</span>}
          </button>
        </div>
        
        {/* Show message when no favorites */}
        {activeFilter === 'favorites' && favorites.length === 0 && (
          <div className="empty-favorites">
            <span className="empty-heart">♡</span>
            <h3>У вас пока нет избранных маршрутов</h3>
            <p>Добавьте маршруты в избранное, нажав на значок сердца</p>
            <button 
              className="filter-btn"
              onClick={() => setActiveFilter('all')}
            >
              Просмотреть все маршруты
            </button>
          </div>
        )}

        {/* No trips message */}
        {trips.length === 0 && (
          <div className="empty-favorites">
            <h3>Маршруты не найдены</h3>
            <p>В данный момент нет доступных маршрутов</p>
          </div>
        )}

        {/* Trips grid */}
        {trips.length > 0 && (activeFilter !== 'favorites' || favorites.length > 0) && (
          <div className="trips-grid">
            {filteredTrips.map(trip => (
              <div key={trip.id} className="trip-card" onClick={() => handleTripClick(trip.id)}>
                <div className="trip-image">
                  <img src={trip.image} alt={trip.title} />
                  <span className="trip-duration">{trip.duration}</span>
                  <button 
                    className={`favorite-btn ${favorites.includes(trip.id) ? 'active' : ''}`}
                    onClick={(e) => toggleFavorite(trip.id, e)}
                    aria-label="Add to favorites"
                  >
                    {favorites.includes(trip.id) 
                      ? <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" strokeWidth="1">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    }
                  </button>
                </div>
                <div className="trip-content">
                  <h3>{trip.title}</h3>
                  <p>{trip.description}</p>
                  <div className="trip-details">
                    <div className="trip-price">{trip.price}тг</div>
                    <div className="trip-rating">
                      <i className="fas fa-star"></i>
                      <span>{trip.rating || trip.averageRating || 4.5}</span>
                    </div>
                  </div>
                  <div className="trip-meta">
                    <span>
                      <i className="fas fa-users"></i>
                      {trip.participants || trip.capacity || 10} участников
                    </span>
                    <span>
                      <i className="fas fa-mountain"></i>
                      {trip.difficulty || 'Средний'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="view-all-trips">
          <Link to="/trips" className="btn btn-primary">
            Смотреть все маршруты
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTripsSection;