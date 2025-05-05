import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Helper function to format image URLs, similar to tripService
const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/300x200?text=No+Image';
    
    // If the URL is already a full URL (starts with http or https), return it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    
    // If the URL starts with "src/", it's a local asset
    if (imageUrl.startsWith('src/')) {
        return imageUrl;
    }
    
    // If the URL starts with "/uploads/", it's a path to a file in the backend
    if (imageUrl.startsWith('/uploads/')) {
        const baseUrlWithoutApi = API_URL.replace('/api/v1', '');
        return `${baseUrlWithoutApi}${imageUrl}`;
    }
    
    // If it's from the backend API (stored in uploads folder but without leading slash)
    if (!imageUrl.includes('/')) {
        return `${API_URL}/uploads/${imageUrl}`;
    }
    
    // Default case, return as is
    return imageUrl;
};

const userService = {
    getProfile: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(`${API_URL}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profile data');
        }
    },

    updateProfile: async (profileData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.put(`${API_URL}/users/profile`, profileData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    },

    uploadProfilePhoto: async (photoFile) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const formData = new FormData();
        formData.append('photo', photoFile);

        try {
            const response = await axios.post(`${API_URL}/users/profile/photo`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Make sure the photoUrl is properly constructed for backend URLs
            const photoUrl = response.data.photoUrl;
            // If it's a local path, prepend the API URL
            if (photoUrl && photoUrl.startsWith('/uploads')) {
                // Ensure API_URL is defined
                const baseUrlWithoutApi = API_URL ? 
                    API_URL.replace('/api/v1', '') : 
                    'http://localhost:8080';
                return {
                    ...response.data,
                    photoUrl: `${baseUrlWithoutApi}${photoUrl}`
                };
            }
            
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to upload profile photo');
        }
    },

    getFavoriteTrips: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(`${API_URL}/users/favorite-trips`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Format the image URLs consistently
            const trips = response.data;
            return trips.map(trip => ({
                ...trip,
                imageUrl: formatImageUrl(trip.image), // Format image URL properly
                date: trip.date || new Date().toISOString() // Provide a fallback date if missing
            }));
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch favorite trips');
        }
    },

    getSubscribedTrips: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(`${API_URL}/users/subscribed-trips`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Format the image URLs consistently
            const trips = response.data;
            return trips.map(trip => ({
                ...trip,
                imageUrl: formatImageUrl(trip.image), // Format image URL properly
                date: trip.date || new Date().toISOString(), // Provide a fallback date if missing
                status: trip.status || (trip.isSubscribed ? 'ACTIVE' : 'PENDING')
            }));
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch subscribed trips');
        }
    },

    getMyReviews: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(`${API_URL}/users/my-reviews`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user reviews');
        }
    },

    getMyPagedReviews: async (page = 0, size = 10, sort = ['createdAt', 'desc']) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(
                `${API_URL}/users/my-reviews/paged?page=${page}&size=${size}&sort=${sort[0]},${sort[1]}`, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch paged user reviews');
        }
    },

    // Admin functions
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
            // If endpoint not available, return mock data for development
            if (process.env.NODE_ENV === 'development') {
                console.warn('Using mock data for users. Admin API endpoint not available.');
                return [
                    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', createdAt: '2023-05-10' },
                    { id: 2, name: 'Test User', email: 'user@example.com', role: 'USER', createdAt: '2023-05-12' },
                    { id: 3, name: 'John Doe', email: 'john@example.com', role: 'USER', createdAt: '2023-05-15' },
                ];
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
            // If endpoint not available, return mock data for development
            if (process.env.NODE_ENV === 'development') {
                console.warn('Using mock data for dashboard stats. Admin API endpoint not available.');
                return {
                    totalUsers: 24,
                    totalTrips: 15,
                    totalBookings: 76,
                    totalRevenue: 3452000,
                    recentBookings: [
                        { id: 1, userId: 2, tripId: 1, status: 'CONFIRMED', createdAt: '2023-06-01', amount: 45000 },
                        { id: 2, userId: 3, tripId: 2, status: 'PENDING', createdAt: '2023-06-02', amount: 35000 },
                        { id: 3, userId: 2, tripId: 3, status: 'CONFIRMED', createdAt: '2023-06-03', amount: 50000 },
                    ]
                };
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch dashboard statistics');
        }
    },

    getAdminBookings: async () => {
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
            // If endpoint not available, return mock data for development
            if (process.env.NODE_ENV === 'development') {
                console.warn('Using mock data for bookings. Admin API endpoint not available.');
                return [
                    { id: 1, userId: 2, tripId: 1, status: 'CONFIRMED', createdAt: '2023-06-01', amount: 45000 },
                    { id: 2, userId: 3, tripId: 2, status: 'PENDING', createdAt: '2023-06-02', amount: 35000 },
                    { id: 3, userId: 2, tripId: 3, status: 'CONFIRMED', createdAt: '2023-06-03', amount: 50000 },
                    { id: 4, userId: 4, tripId: 1, status: 'CANCELLED', createdAt: '2023-06-04', amount: 45000 },
                    { id: 5, userId: 5, tripId: 2, status: 'CONFIRMED', createdAt: '2023-06-05', amount: 35000 },
                ];
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
        }
    }
};

export default userService;
