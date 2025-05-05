import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const adminService = {
    
    getAllUsers: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(`${API_URL}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            
            
            if (import.meta.env.DEV) {
                console.warn('Using mock data for users. Admin API endpoint not available.');
            }
            
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    },

    
    getUserById: async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(`${API_URL}/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user details');
        }
    },

    
    updateUser: async (userId, userData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.put(`${API_URL}/admin/users/${userId}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update user');
        }
    },

    
    deleteUser: async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            await axios.delete(`${API_URL}/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete user');
        }
    },

    
    getAllBookings: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(`${API_URL}/admin/bookings`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
        }
    },

    
    updateBookingStatus: async (bookingId, status) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.put(`${API_URL}/admin/bookings/${bookingId}/status`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update booking status');
        }
    },

    
    getDashboardStats: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(`${API_URL}/admin/dashboard/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            
        
            if (import.meta.env.DEV) {
                console.warn('Using mock data for dashboard stats. Admin API endpoint not available.');
            }
            
            throw new Error(error.response?.data?.message || 'Failed to fetch dashboard statistics');
        }
    }
};

export default adminService; 