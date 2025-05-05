import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/AdminPanel.css';
import authService from '../services/authService';
import tripService from '../services/tripService';
import adminService from '../services/adminService';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTrips: 0,
        totalBookings: 0,
        totalRevenue: 0,
    });
    const [users, setUsers] = useState([]);
    const [trips, setTrips] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // Check if user is admin, if not redirect to home
        if (!authService.isAuthenticated() || !authService.isAdmin()) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Load trips
                const tripsData = await tripService.getAllTrips();
                setTrips(tripsData);

                // Load users
                try {
                    const usersData = await adminService.getAllUsers();
                    setUsers(usersData);
                } catch (error) {
                    console.error('Error fetching users:', error);
                    setError('Failed to load users. Using mock data instead.');
                }

                // Load bookings
                try {
                    const bookingsData = await adminService.getAllBookings();
                    setBookings(bookingsData);
                } catch (error) {
                    console.error('Error fetching bookings:', error);
                    setError('Failed to load bookings. Using mock data instead.');
                }

                // Get dashboard statistics
                try {
                    const dashboardStats = await adminService.getDashboardStats();
                    setStats({
                        totalUsers: dashboardStats.totalUsers,
                        totalTrips: dashboardStats.totalTrips,
                        totalBookings: dashboardStats.totalBookings,
                        totalRevenue: dashboardStats.totalRevenue
                    });
                } catch (error) {
                    console.error('Error fetching dashboard stats:', error);
                    // Calculate stats from loaded data as fallback
                    setStats({
                        totalUsers: users.length,
                        totalTrips: tripsData.length,
                        totalBookings: bookings.length,
                        totalRevenue: bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0)
                    });
                }

            } catch (error) {
                console.error('Error fetching admin data:', error);
                setError('Failed to load admin data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
        
        try {
            await adminService.deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            setError('Failed to delete user. Please try again.');
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteTrip = async (tripId) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту поездку?')) return;
        
        try {
            await tripService.deleteTrip(tripId);
            setTrips(trips.filter(trip => trip.id !== tripId));
        } catch (error) {
            setError('Failed to delete trip. Please try again.');
            console.error('Error deleting trip:', error);
        }
    };

    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        try {
            await adminService.updateBookingStatus(bookingId, newStatus);
            setBookings(bookings.map(booking => 
                booking.id === bookingId ? { ...booking, status: newStatus } : booking
            ));
        } catch (error) {
            setError('Failed to update booking status. Please try again.');
            console.error('Error updating booking status:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const formatCurrency = (amount) => {
        return amount?.toLocaleString() + ' ₸';
    };

    // Render different sections based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="admin-dashboard">
                        <h2>Приборная панель</h2>
                        <div className="stats-cards">
                            <div className="stat-card">
                                <h3>Пользователи</h3>
                                <p className="stat-number">{stats.totalUsers}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Поездки</h3>
                                <p className="stat-number">{stats.totalTrips}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Бронирование</h3>
                                <p className="stat-number">{stats.totalBookings}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Выручка</h3>
                                <p className="stat-number">{formatCurrency(stats.totalRevenue)}</p>
                            </div>
                        </div>
                        <div className="recent-activity">
                            <h3>Последние заказы</h3>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Trip</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length > 0 ? (
                                        bookings.slice(0, 5).map(booking => (
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
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="empty-table">No bookings found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            
            case 'users':
                return (
                    <div className="admin-users">
                        <h2>Управление пользователями</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.fullName || user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge ${user.role?.toLowerCase()}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{formatDate(user.createdAt)}</td>
                                            <td className="actions-cell">
                                                <button className="edit-btn" onClick={() => alert('Edit functionality to be implemented')}>
                                                    Edit
                                                </button>
                                                <button 
                                                    className="delete-btn" 
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={user.role === 'ADMIN'}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="empty-table">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            
            case 'trips':
                return (
                    <div className="admin-trips">
                        <h2>Управление поездками</h2>
                        <div className="admin-actions-bar">
                            <button 
                                className="add-new-btn" 
                                onClick={() => navigate('/trips')}
                            >
                                Add New Trip
                            </button>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Location</th>
                                    <th>Duration</th>
                                    <th>Price</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trips.length > 0 ? (
                                    trips.map(trip => (
                                        <tr key={trip.id}>
                                            <td>{trip.id}</td>
                                            <td>{trip.title}</td>
                                            <td>{trip.location}</td>
                                            <td>{trip.duration}</td>
                                            <td>{formatCurrency(trip.price)}</td>
                                            <td>{trip.averageRating?.toFixed(1) || 'N/A'}</td>
                                            <td className="actions-cell">
                                                <button className="view-btn" onClick={() => navigate(`/trip/${trip.id}`)}>
                                                    View
                                                </button>
                                                <button className="edit-btn" onClick={() => navigate(`/trip/${trip.id}`)}>
                                                    Edit
                                                </button>
                                                <button className="delete-btn" onClick={() => handleDeleteTrip(trip.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="empty-table">No trips found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            
            case 'bookings':
                return (
                    <div className="admin-bookings">
                        <h2>Управление бронированиями</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Trip</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
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
                                                        className="edit-btn" 
                                                        onClick={() => handleUpdateBookingStatus(booking.id, 'CONFIRMED')}
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                                {booking.status !== 'CANCELLED' && (
                                                    <button 
                                                        className="cancel-btn" 
                                                        onClick={() => handleUpdateBookingStatus(booking.id, 'CANCELLED')}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="empty-table">No bookings found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            
            default:
                return <div>Выберите вкладку для просмотра содержимого</div>;
        }
    };

    return (
        <>
            <Header />
            <div className="admin-panel">
                <div className="admin-container">
                    <h1>Панель администратора</h1>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loader"></div>
                            <p>Loading data...</p>
                        </div>
                    ) : (
                        <div className="admin-content">
                            <div className="admin-sidebar">
                                <ul className="admin-nav">
                                    <li 
                                        className={activeTab === 'dashboard' ? 'active' : ''}
                                        onClick={() => setActiveTab('dashboard')}
                                    >
                                        Приборная панель
                                    </li>
                                    <li 
                                        className={activeTab === 'users' ? 'active' : ''}
                                        onClick={() => setActiveTab('users')}
                                    >
                                        Пользователи
                                    </li>
                                    <li 
                                        className={activeTab === 'trips' ? 'active' : ''}
                                        onClick={() => setActiveTab('trips')}
                                    >
                                        Поездки
                                    </li>
                                    <li 
                                        className={activeTab === 'bookings' ? 'active' : ''}
                                        onClick={() => setActiveTab('bookings')}
                                    >
                                        Бронирование
                                    </li>
                                </ul>
                            </div>
                            <div className="admin-main-content">
                                {renderContent()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AdminPanel; 