import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/TripsPage.css';
import Header from './Header';
import Footer from './Footer';
import tripService from '../services/tripService';
import authService from '../services/authService';



const TripsPage = () => {
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [editingTripId, setEditingTripId] = useState(null);
    const [newTrip, setNewTrip] = useState({
        title: '',
        description: '',
        location: '',
        duration: '',
        difficulty: 'Легкая',
        price: '',
        image: null
    });
    const [editTrip, setEditTrip] = useState({
        title: '',
        description: '',
        location: '',
        duration: '',
        difficulty: 'Легкая',
        price: '',
        image: null,
        isFavorite: false,
        rating: 0
    });
    

    const [filters, setFilters] = useState({
        search: '',
        difficulty: '',
        duration: '',
        minPrice: '',
        maxPrice: '',
        location: '',
        showFavorites: false
    });

    const [imageFile, setImageFile] = useState(null);
    const [editImageFile, setEditImageFile] = useState(null);

    useEffect(() => {
    
        const currentUser = authService.getCurrentUser();
        console.log('Current user:', currentUser);
        console.log('Is admin?', authService.isAdmin());
        setIsAdmin(authService.isAdmin());
        
        
        const fetchTrips = async () => {
            try {
                setIsLoading(true);
                const response = await tripService.getAllTrips();
                console.log('API Response:', response);
                
                let tripsData = [];
                
                if (Array.isArray(response) && response.length > 0) {
                    console.log('Response is an array with', response.length, 'items');
                    tripsData = response;
                } else if (response && typeof response === 'object') {
                   
                    if (Array.isArray(response.data) && response.data.length > 0) {
                        console.log('Response has data array with', response.data.length, 'items');
                        tripsData = response.data;
                    } else if (Array.isArray(response.content) && response.content.length > 0) {
                        console.log('Response has content array with', response.content.length, 'items');
                        tripsData = response.content;
                    } else if (Array.isArray(response.trips) && response.trips.length > 0) {
                        console.log('Response has trips array with', response.trips.length, 'items');
                        tripsData = response.trips;
                    } else if (Array.isArray(response.results) && response.results.length > 0) {
                        console.log('Response has results array with', response.results.length, 'items');
                        tripsData = response.results;
                    } else if (Array.isArray(response.items) && response.items.length > 0) {
                        console.log('Response has items array with', response.items.length, 'items');
                        tripsData = response.items;
                    } else {
                        console.warn('Response format unknown or empty');
                      
                        tripsData = [];
                    }
                } else {
                    console.warn('Unexpected response format or empty');
                    
                    tripsData = [];
                }
                
                
                tripsData = tripsData.map(trip => ({
                    id: trip.id || Math.random().toString(36).substr(2, 9),
                    title: trip.title || 'Unnamed Trip',
                    description: trip.description || 'No description',
                    location: trip.location || 'Unknown location',
                    duration: trip.duration || 'Duration not specified',
                    difficulty: trip.difficulty || 'Not specified',
                    price: trip.price || 0,
                    image: trip.image || 'https://via.placeholder.com/300x200?text=No+Image',
                    isFavorite: trip.isFavorite || false,
                    averageRating: trip.averageRating || 0,
                    rating: trip.rating || 0,
                    reviewCount: trip.reviewCount || 0
                }));
                
                console.log('Processed trips data:', tripsData);
                setTrips(tripsData);
                setFilteredTrips(tripsData);
            } catch (err) {
                console.error('Error fetching trips:', err);
                setTrips([]);
                setFilteredTrips([]);
                setError('Не удалось загрузить поездки. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrips();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, trips]);

    const applyFilters = () => {
        let results = [...trips];

        
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            results = results.filter(trip => 
                trip.title.toLowerCase().includes(searchTerm) || 
                trip.description.toLowerCase().includes(searchTerm) ||
                trip.location.toLowerCase().includes(searchTerm)
            );
        }

        
        if (filters.difficulty) {
            results = results.filter(trip => trip.difficulty === filters.difficulty);
        }

        
        if (filters.duration) {
            results = results.filter(trip => {
                const dayCount = parseInt(trip.duration.split(' ')[0]);
                switch(filters.duration) {
                    case 'short': return dayCount <= 2;
                    case 'medium': return dayCount > 2 && dayCount <= 5;
                    case 'long': return dayCount > 5;
                    default: return true;
                }
            });
        }

       
        if (filters.minPrice) {
            results = results.filter(trip => trip.price >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            results = results.filter(trip => trip.price <= Number(filters.maxPrice));
        }

        
        if (filters.location) {
            results = results.filter(trip => 
                trip.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        
        if (filters.showFavorites) {
            results = results.filter(trip => trip.isFavorite);
        }

        setFilteredTrips(results);
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            difficulty: '',
            duration: '',
            minPrice: '',
            maxPrice: '',
            location: '',
            showFavorites: true
        });
    };

    const toggleFavorite = async (tripId) => {
        if (!tripId) {
            console.error('toggleFavorite called with invalid tripId:', tripId);
            return;
        }
        
        
        if (!authService.isAuthenticated()) {
            setError('Пожалуйста, войдите в систему, чтобы добавить маршрут в избранное');
            return;
        }
        
        try {
            
            const tripToUpdate = trips.find(trip => trip.id === tripId);
            if (!tripToUpdate) {
                console.error('Trip not found with id:', tripId);
                return;
            }
            
            const newFavoriteStatus = !tripToUpdate.isFavorite;
            console.log(`Setting favorite status for trip ${tripId} to ${newFavoriteStatus}`);
            
            
            setTrips(prevTrips => prevTrips.map(trip => 
                trip.id === tripId 
                    ? { ...trip, isFavorite: newFavoriteStatus } 
                    : trip
            ));
            
           
            try {
                const result = await tripService.toggleFavorite(tripId, newFavoriteStatus);
                console.log(`Successfully set favorite for trip ${tripId} to ${newFavoriteStatus}`, result);
                
                
                if (result.isFavorite !== newFavoriteStatus) {
                    console.warn('API returned different favorite state than requested, updating UI to match');
                    setTrips(prevTrips => prevTrips.map(trip => 
                        trip.id === tripId 
                            ? { ...trip, isFavorite: result.isFavorite } 
                            : trip
                    ));
                }
            } catch (apiError) {
                console.error('API error when setting favorite:', apiError);
                
                setTrips(prevTrips => prevTrips.map(trip => 
                    trip.id === tripId 
                        ? { ...trip, isFavorite: !newFavoriteStatus } 
                        : trip
                ));
                setError('Не удалось обновить избранное. Пожалуйста, попробуйте позже.');
            }
        } catch (err) {
            console.error('Error in toggleFavorite function:', err);
            setError('Не удалось обновить избранное. Пожалуйста, попробуйте позже.');
        }
    };

    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        setNewTrip(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            
            const imagePreviewUrl = URL.createObjectURL(file);
            setNewTrip(prev => ({
                ...prev,
                image: imagePreviewUrl
            }));
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImageFile(file);
            
            const imagePreviewUrl = URL.createObjectURL(file);
            setEditTrip(prev => ({
                ...prev,
                image: imagePreviewUrl
            }));
        }
    };

    
    const handleApiError = (error, defaultMessage) => {
        console.error(error);
        if (error.message && error.message.includes('Unauthorized')) {
            setError('У вас нет прав для выполнения этого действия. Необходимы права администратора.');
        } else {
            setError(defaultMessage);
        }
    };

    const handleCreateTrip = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            setError('');
            
           
            const createdTrip = await tripService.createTrip({
                ...newTrip,
                
                image: null
            });
            
            
            if (imageFile) {
                await tripService.uploadMainImage(createdTrip.id, imageFile);
            }
            
            setNewTrip({
                title: '',
                description: '',
                location: '',
                duration: '',
                difficulty: '',
                price: 0,
                image: null,
                capacity: 10,
                requiredItems: '',
                additionalInfo: ''
            });
            setImageFile(null);
            
            fetchTrips();
            setShowCreateForm(false);
        } catch (err) {
            handleApiError(err, 'Не удалось создать маршрут. Пожалуйста, попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTrip = async (tripId) => {
        if (!tripId) {
            console.error('deleteTrip called with invalid tripId:', tripId);
            return;
        }
        
        if (!window.confirm('Вы уверены, что хотите удалить эту поездку?')) {
            return;
        }
        
        try {
            setIsLoading(true);
            await tripService.deleteTrip(tripId);
            
            setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
            setError('');
        } catch (err) {
            handleApiError(err, 'Не удалось удалить поездку. Пожалуйста, попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditTrip(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const startEditTrip = (tripId) => {
        if (!tripId) {
            console.error('startEditTrip called with invalid tripId:', tripId);
            return;
        }
        
        const tripToEdit = trips.find(trip => trip.id === tripId);
        if (tripToEdit) {
            setEditTrip({
                ...tripToEdit,
                price: String(tripToEdit.price || 0)
            });
            setEditingTripId(tripId);
            setShowEditForm(true);
            setShowCreateForm(false);
        } else {
            console.error('Trip not found with id:', tripId);
            setError('Маршрут не найден.');
        }
    };

    const cancelEdit = () => {
        setShowEditForm(false);
        setEditingTripId(null);
    };

    const handleUpdateTrip = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            setError('');
            
            const updatedTrip = await tripService.updateTrip(editTrip.id, {
                ...editTrip,

                image: editImageFile ? null : editTrip.image
            });
            

            if (editImageFile) {
                await tripService.uploadMainImage(updatedTrip.id, editImageFile);
            }
            

            setEditTrip(null);
            setEditImageFile(null);
            

            fetchTrips();
            setShowEditForm(false);
        } catch (err) {
            handleApiError(err, 'Не удалось обновить маршрут. Пожалуйста, попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        console.log('filteredTrips:', filteredTrips);
        console.log('filteredTrips length:', filteredTrips.length);

        if (filteredTrips.length > 0) {
            const firstTrip = filteredTrips[0];
            console.log('Sample trip object:', firstTrip);
            console.log('Required properties present:', 
                'id' in firstTrip,
                'title' in firstTrip,
                'description' in firstTrip,
                'location' in firstTrip,
                'duration' in firstTrip,
                'difficulty' in firstTrip,
                'price' in firstTrip,
                'rating' in firstTrip,
                'image' in firstTrip,
                'isFavorite' in firstTrip
            );
        }
    }, [filteredTrips]);

    return (
        <>
            <Header />
            <div className="trips-page">
                <div className="trips-container">
                    <div className="trips-header">
                        <h1>Маршруты путешествий</h1>
                        <div className="header-actions">
                            {isAdmin && (
                                <button 
                                    className="create-trip-btn"
                                    onClick={() => {
                                        setShowCreateForm(!showCreateForm);
                                        setShowEditForm(false);
                                    }}
                                    disabled={showEditForm}
                                >
                                    {showCreateForm ? 'Отменить' : 'Создать новый маршрут'}
                                </button>
                            )}
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {showCreateForm && isAdmin && (
                        <div className="create-trip-form">
                            <h2>Создать новый маршрут</h2>
                            <form onSubmit={handleCreateTrip}>
                                <div className="form-group">
                                    <label>Название*</label>
                                    <input 
                                        type="text" 
                                        name="title"
                                        value={newTrip.title}
                                        onChange={handleCreateInputChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Описание*</label>
                                    <textarea 
                                        name="description"
                                        value={newTrip.description}
                                        onChange={handleCreateInputChange}
                                        required
                                    ></textarea>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Местоположение*</label>
                                        <input 
                                            type="text" 
                                            name="location"
                                            value={newTrip.location}
                                            onChange={handleCreateInputChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Продолжительность*</label>
                                        <input 
                                            type="text" 
                                            name="duration"
                                            placeholder="Например: 3 дня"
                                            value={newTrip.duration}
                                            onChange={handleCreateInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Сложность</label>
                                        <select 
                                            name="difficulty"
                                            value={newTrip.difficulty}
                                            onChange={handleCreateInputChange}
                                        >
                                            <option value="Легкая">Легкая</option>
                                            <option value="Средняя">Средняя</option>
                                            <option value="Сложная">Сложная</option>
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Цена (тенге)*</label>
                                        <input 
                                            type="number" 
                                            name="price"
                                            value={newTrip.price}
                                            onChange={handleCreateInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>Фото маршрута</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {newTrip.image && (
                                        <div className="image-preview">
                                            <img src={newTrip.image} alt="Preview" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="form-actions">
                                    <button type="submit" className="submit-btn">Создать маршрут</button>
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setShowCreateForm(false)}
                                    >
                                        Отменить
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {showEditForm && isAdmin && (
                        <div className="edit-trip-form">
                            <h2>Редактировать маршрут</h2>
                            <form onSubmit={handleUpdateTrip}>
                                <div className="form-group">
                                    <label>Название*</label>
                                    <input 
                                        type="text" 
                                        name="title"
                                        value={editTrip.title}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>Описание*</label>
                                    <textarea 
                                        name="description"
                                        value={editTrip.description}
                                        onChange={handleEditInputChange}
                                        required
                                    ></textarea>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Местоположение*</label>
                                        <input 
                                            type="text" 
                                            name="location"
                                            value={editTrip.location}
                                            onChange={handleEditInputChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Продолжительность*</label>
                                        <input 
                                            type="text" 
                                            name="duration"
                                            placeholder="Например: 3 дня"
                                            value={editTrip.duration}
                                            onChange={handleEditInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Сложность</label>
                                        <select 
                                            name="difficulty"
                                            value={editTrip.difficulty}
                                            onChange={handleEditInputChange}
                                        >
                                            <option value="Легкая">Легкая</option>
                                            <option value="Средняя">Средняя</option>
                                            <option value="Сложная">Сложная</option>
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Цена (тенге)*</label>
                                        <input 
                                            type="number" 
                                            name="price"
                                            value={editTrip.price}
                                            onChange={handleEditInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>Фото маршрута</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleEditImageChange}
                                    />
                                    {editTrip.image && (
                                        <div className="image-preview">
                                            <img src={editTrip.image} alt="Preview" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="form-actions">
                                    <button type="submit" className="submit-btn">Сохранить изменения</button>
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={cancelEdit}
                                    >
                                        Отменить
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="trips-filters">
                        <div className="search-container">
                            <input 
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Поиск по названию, описанию, месту..."
                                className="search-input"
                            />
                        </div>
                        
                        <div className="filters-row">
                            <div className="filter-group">
                                <label>Сложность</label>
                                <select 
                                    name="difficulty"
                                    value={filters.difficulty}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Все</option>
                                    <option value="Легкая">Легкая</option>
                                    <option value="Средняя">Средняя</option>
                                    <option value="Сложная">Сложная</option>
                                </select>
                            </div>
                            
                            <div className="filter-group">
                                <label>Продолжительность</label>
                                <select 
                                    name="duration"
                                    value={filters.duration}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Все</option>
                                    <option value="short">1-2 дня</option>
                                    <option value="medium">3-5 дней</option>
                                    <option value="long">Более 5 дней</option>
                                </select>
                            </div>
                            
                            <div className="filter-group">
                                <label>Местоположение</label>
                                <input 
                                    type="text"
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    placeholder="Город или регион"
                                />
                            </div>
                            
                            <div className="filter-group price-range">
                                <label>Цена (тенге)</label>
                                <div className="price-inputs">
                                    <input 
                                        type="number"
                                        name="minPrice"
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                        placeholder="От"
                                    />
                                    <span>-</span>
                                    <input 
                                        type="number"
                                        name="maxPrice"
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                        placeholder="До"
                                    />
                                </div>
                            </div>
                            
                            <div className="filter-group favorites-filter">
                                <label className="checkbox-container">
                                    <span>Только избранные</span>
                                    <input 
                                        type="checkbox"
                                        name="showFavorites"
                                        checked={filters.showFavorites}
                                        onChange={handleFilterChange}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                            
                            <button 
                                className="reset-filters-btn"
                                onClick={resetFilters}
                            >
                                Сбросить фильтры
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loader"></div>
                            <p>Загрузка маршрутов...</p>
                        </div>
                    ) : filteredTrips.length > 0 ? (
                        <div className="trips-grid">
                            {filteredTrips.map(trip => (
                                <div className="trip-card" key={trip.id || Math.random()}>
                                    <div className="trip-image">
                                        <img src={trip.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={trip.title || 'Trip'} />
                                        <button 
                                            className={`favorite-btn ${trip.isFavorite ? 'active' : ''}`}
                                            onClick={() => toggleFavorite(trip.id)}
                                        >
                                            {trip.isFavorite ? '★' : '☆'}
                                        </button>
                                    </div>
                                    <div className="trip-content">
                                        <h3>{trip.title || 'Untitled Trip'}</h3>
                                        <div className="trip-meta">
                                            <span className="location">{trip.location || 'Location not specified'}</span>
                                            <span className="duration">{trip.duration || 'Duration not specified'}</span>
                                            <span className="difficulty">{trip.difficulty || 'Difficulty not specified'}</span>
                                        </div>
                                        <p className="trip-description">{trip.description || 'No description available'}</p>
                                        <div className="trip-footer">
                                            <div className="price-rating">
                                                <span className="price">{(trip.price !== undefined ? trip.price.toLocaleString() : '0')} ₸</span>
                                                <span className="rating">★ {trip.averageRating !== undefined && trip.averageRating !== null ? trip.averageRating.toFixed(1) : (trip.rating !== undefined && trip.rating !== null ? trip.rating.toFixed(1) : '0.0')}</span>
                                            </div>
                                            <Link to={`/trip/${trip.id}`} className="view-details-btn">
                                                Подробнее
                                            </Link>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <div className="trip-actions">
                                            <button 
                                                className="edit-btn"
                                                onClick={() => startEditTrip(trip.id)}
                                            >
                                                Изменить
                                            </button>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => deleteTrip(trip.id)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <h3>Маршруты не найдены</h3>
                            <p>Попробуйте изменить параметры поиска или сбросить фильтры</p>
                            <button onClick={resetFilters} className="reset-btn">
                                Сбросить фильтры
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TripsPage; 