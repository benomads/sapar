import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const managerService = {
    // Trip management
    getAllTrips: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(`${API_URL}/manager/trips`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching trips:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch trips');
        }
    },

    createTrip: async (tripData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.post(`${API_URL}/manager/trips/create`, tripData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create trip');
        }
    },

    updateTrip: async (tripId, tripData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.put(`${API_URL}/manager/trips/${tripId}/edit`, tripData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update trip');
        }
    },

    deleteTrip: async (tripId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            await axios.delete(`${API_URL}/manager/trips/${tripId}/delete`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return true;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete trip');
        }
    },

    uploadMainImage: async (tripId, imageFile) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await axios.post(`${API_URL}/manager/trips/${tripId}/upload-image`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to upload image');
        }
    },

    uploadAdditionalImages: async (tripId, imageFiles) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const formData = new FormData();
        imageFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            const response = await axios.post(`${API_URL}/manager/trips/${tripId}/upload-additional-images`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to upload additional images');
        }
    },

    // Booking management
    getAllBookings: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(`${API_URL}/manager/bookings`, {
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

    getBookingsByTripId: async (tripId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.get(`${API_URL}/manager/bookings/${tripId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching bookings for trip:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch bookings for trip');
        }
    },

    confirmBooking: async (bookingId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.put(`${API_URL}/manager/bookings/${bookingId}/confirm`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to confirm booking');
        }
    },

    cancelBooking: async (bookingId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await axios.put(`${API_URL}/manager/bookings/${bookingId}/cancel`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to cancel booking');
        }
    }
};

export default managerService; 