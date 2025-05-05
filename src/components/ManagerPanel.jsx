import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/AdminPanel.css'; // Reusing admin panel styles
import authService from '../services/authService';
import tripService from '../services/tripService';
import managerService from '../services/managerService';

const ManagerPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('trips');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [trips, setTrips] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [bookingsForTrip, setBookingsForTrip] = useState([]);

    useEffect(() => {
        // Check if user is manager, if not redirect to home
        if (!authService.isAuthenticated() || !authService.isManager()) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Load trips
                const tripsData = await managerService.getAllTrips();
                setTrips(tripsData);

                // Load all bookings
                try {
                    const bookingsData = await managerService.getAllBookings();
                    setBookings(bookingsData);
                } catch (error) {
                    console.error('Error fetching bookings:', error);
                    setError('Failed to load bookings. Please try again later.');
                }
            } catch (error) {
                console.error('Error fetching manager data:', error);
                setError('Failed to load data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    useEffect(() => {
        // Fetch bookings for selected trip
        const fetchBookingsForTrip = async () => {
            if (!selectedTrip) return;
            
            try {
                const bookingsData = await managerService.getBookingsByTripId(selectedTrip.id);
                setBookingsForTrip(bookingsData);
            } catch (error) {
                console.error('Error fetching bookings for trip:', error);
                setError('Failed to load bookings for this trip.');
            }
        };

        fetchBookingsForTrip();
    }, [selectedTrip]);

    const handleDeleteTrip = async (tripId) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту поездку?')) return;
        
        try {
            await managerService.deleteTrip(tripId);
            setTrips(trips.filter(trip => trip.id !== tripId));
        } catch (error) {
            setError('Не удалось удалить поездку. Пожалуйста, попробуйте снова.');
            console.error('Error deleting trip:', error);
        }
    };

    const handleConfirmBooking = async (bookingId) => {
        try {
            const updatedBooking = await managerService.confirmBooking(bookingId);
            
            // Update both bookings lists
            setBookings(bookings.map(booking => 
                booking.id === bookingId ? updatedBooking : booking
            ));
            
            setBookingsForTrip(bookingsForTrip.map(booking => 
                booking.id === bookingId ? updatedBooking : booking
            ));
        } catch (error) {
            setError('Не удалось подтвердить бронирование. Пожалуйста, попробуйте снова.');
            console.error('Error confirming booking:', error);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) return;
        
        try {
            const updatedBooking = await managerService.cancelBooking(bookingId);
            
            // Update both bookings lists
            setBookings(bookings.map(booking => 
                booking.id === bookingId ? updatedBooking : booking
            ));
            
            setBookingsForTrip(bookingsForTrip.map(booking => 
                booking.id === bookingId ? updatedBooking : booking
            ));
        } catch (error) {
            setError('Не удалось отменить бронирование. Пожалуйста, попробуйте снова.');
            console.error('Error canceling booking:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const formatCurrency = (amount) => {
        return amount?.toLocaleString() + ' ₸';
    };

    const renderTripsTab = () => (
        <div className="admin-trips">
            <h2>Управление поездками</h2>
            <div className="action-buttons">
                <button 
                    className="create-btn"
                    onClick={() => navigate('/create-trip')}
                >
                    Создать новую поездку
                </button>
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Локация</th>
                        <th>Даты</th>
                        <th>Цена</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {trips.length > 0 ? (
                        trips.map(trip => (
                            <tr key={trip.id}>
                                <td>{trip.id}</td>
                                <td>{trip.title}</td>
                                <td>{trip.location}</td>
                                <td>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</td>
                                <td>{formatCurrency(trip.price)}</td>
                                <td>
                                    <span className={`status-badge ${trip.status?.toLowerCase()}`}>
                                        {trip.status || 'Активно'}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <button 
                                        className="view-btn"
                                        onClick={() => setSelectedTrip(trip)}
                                    >
                                        Бронирования
                                    </button>
                                    <button 
                                        className="edit-btn"
                                        onClick={() => navigate(`/edit-trip/${trip.id}`)}
                                    >
                                        Изменить
                                    </button>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDeleteTrip(trip.id)}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="empty-table">Нет поездок</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderBookingsTab = () => (
        <div className="admin-bookings">
            <h2>Управление бронированиями</h2>
            {selectedTrip ? (
                <div className="selected-trip-bookings">
                    <h3>Бронирования для: {selectedTrip.title}</h3>
                    <button 
                        className="back-btn"
                        onClick={() => setSelectedTrip(null)}
                    >
                        Назад ко всем бронированиям
                    </button>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Пользователь</th>
                                <th>Дата создания</th>
                                <th>Количество людей</th>
                                <th>Сумма</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingsForTrip.length > 0 ? (
                                bookingsForTrip.map(booking => (
                                    <tr key={booking.id}>
                                        <td>{booking.id}</td>
                                        <td>{booking.userName || 'Unknown'}</td>
                                        <td>{formatDate(booking.createdAt)}</td>
                                        <td>{booking.personCount || 1}</td>
                                        <td>{formatCurrency(booking.amount)}</td>
                                        <td>
                                            <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            {booking.status !== 'CONFIRMED' && (
                                                <button 
                                                    className="confirm-btn"
                                                    onClick={() => handleConfirmBooking(booking.id)}
                                                >
                                                    Подтвердить
                                                </button>
                                            )}
                                            {booking.status !== 'CANCELLED' && (
                                                <button 
                                                    className="cancel-btn"
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                >
                                                    Отменить
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="empty-table">Нет бронирований для этой поездки</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Пользователь</th>
                            <th>Поездка</th>
                            <th>Дата</th>
                            <th>Сумма</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? (
                            bookings.map(booking => (
                                <tr key={booking.id}>
                                    <td>{booking.id}</td>
                                    <td>{booking.userName || 'Unknown'}</td>
                                    <td>{booking.tripTitle || 'Unknown'}</td>
                                    <td>{formatDate(booking.createdAt)}</td>
                                    <td>{formatCurrency(booking.amount)}</td>
                                    <td>
                                        <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        {booking.status !== 'CONFIRMED' && (
                                            <button 
                                                className="confirm-btn"
                                                onClick={() => handleConfirmBooking(booking.id)}
                                            >
                                                Подтвердить
                                            </button>
                                        )}
                                        {booking.status !== 'CANCELLED' && (
                                            <button 
                                                className="cancel-btn"
                                                onClick={() => handleCancelBooking(booking.id)}
                                            >
                                                Отменить
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="empty-table">Нет бронирований</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'trips':
                return renderTripsTab();
            case 'bookings':
                return renderBookingsTab();
            default:
                return renderTripsTab();
        }
    };

    return (
        <div className="admin-panel-container">
            <Header />
            <div className="admin-panel">
                <div className="admin-sidebar">
                    <h2>Панель менеджера</h2>
                    <ul className="admin-menu">
                        <li
                            className={activeTab === 'trips' ? 'active' : ''}
                            onClick={() => setActiveTab('trips')}
                        >
                            <i className="fas fa-map-marked-alt"></i> Поездки
                        </li>
                        <li
                            className={activeTab === 'bookings' ? 'active' : ''}
                            onClick={() => setActiveTab('bookings')}
                        >
                            <i className="fas fa-calendar-check"></i> Бронирования
                        </li>
                    </ul>
                </div>
                <div className="admin-content">
                    {isLoading ? (
                        <div className="loading-spinner">Загрузка...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : (
                        renderContent()
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ManagerPanel; 