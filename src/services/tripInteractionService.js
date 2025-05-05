import axios from 'axios';
import authService from './authService';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const tripInteractionService = {
    // Get all comments for a trip
    async getComments(tripId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/trips/${tripId}/comments`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error.response?.data || error.message;
        }
    },

    // Add a new comment to a trip
    async addComment(tripId, comment) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/trips/${tripId}/comments`, 
                comment,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error.response?.data || error.message;
        }
    },

    // Get all reviews for a trip
    async getReviews(tripId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/trips/${tripId}/reviews`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error.response?.data || error.message;
        }
    },

    // Get the current user's review for a trip
    async getUserReview(tripId) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/trips/${tripId}/reviews/user`, 
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            // If 404, it means user hasn't reviewed yet
            if (error.response?.status === 404) {
                return null;
            }
            console.error('Error fetching user review:', error);
            throw error.response?.data || error.message;
        }
    },

    // Submit a review for a trip
    async submitReview(tripId, review) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/trips/${tripId}/reviews`,
                review,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error submitting review:', error);
            throw error.response?.data || error.message;
        }
    },

    // Update an existing review
    async updateReview(tripId, reviewId, review) {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/trips/${tripId}/reviews/${reviewId}`,
                review,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating review:', error);
            throw error.response?.data || error.message;
        }
    },

    // Check if user is subscribed to a trip
    async checkSubscription(tripId) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/trips/${tripId}/subscription`,
                { headers: getAuthHeader() }
            );
            return response.data.subscribed;
        } catch (error) {
            // If 404, it means user isn't subscribed
            if (error.response?.status === 404) {
                return false;
            }
            console.error('Error checking subscription:', error);
            throw error.response?.data || error.message;
        }
    },

    // Subscribe to a trip
    async subscribeToTrip(tripId) {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/trips/${tripId}/subscription`,
                {},
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error subscribing to trip:', error);
            throw error.response?.data || error.message;
        }
    },

    // Unsubscribe from a trip
    async unsubscribeFromTrip(tripId) {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/trips/${tripId}/subscription`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error unsubscribing from trip:', error);
            throw error.response?.data || error.message;
        }
    }
};

export default tripInteractionService; 