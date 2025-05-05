import axios from 'axios';
import authService from './authService';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper to check admin permission before making admin-only API calls
const checkAdminPermission = () => {
    if (!authService.isAdmin()) {
        throw new Error('Unauthorized: Admin permission required');
    }
};

// Helper to format image URLs
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
        const baseUrlWithoutApi = API_BASE_URL.replace('/api/v1', '');
        return `${baseUrlWithoutApi}${imageUrl}`;
    }
    
    // If it's from the backend API (stored in uploads folder but without leading slash)
    if (!imageUrl.includes('/')) {
        return `${API_BASE_URL}/uploads/${imageUrl}`;
    }
    
    // Default case, return as is
    return imageUrl;
};

// Also apply the same formatting to additional images
const formatAdditionalImages = (images) => {
    if (!images || !Array.isArray(images)) return [];
    return images.map(imageUrl => formatImageUrl(imageUrl));
};

const tripService = {
    async getAllTrips() {
        try {
            console.log('Making API request to:', `${API_BASE_URL}/trips`);
            console.log('With headers:', getAuthHeader());
            
            const response = await axios.get(`${API_BASE_URL}/trips`, {
                headers: getAuthHeader(),
                timeout: 10000 // Add timeout to prevent hanging requests
            });
            
            console.log('Full API response:', response);
            
            if (response.status !== 200) {
                console.error('Non-200 status received:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Check the shape of the data for debugging
            const data = response.data;
            console.log('Response data type:', typeof data);
            console.log('Response data:', data);
            
            // Check if data is null or undefined
            if (!data) {
                console.error('API returned null or undefined data');
                return [];
            }
            
            // Get the trips array from the response
            let tripsArray = [];
            
            // If it's an array, use it directly
            if (Array.isArray(data)) {
                tripsArray = data;
            } 
            // If it's an object with a data/content/items/trips property that's an array, use that
            else if (typeof data === 'object') {
                if (Array.isArray(data.data)) tripsArray = data.data;
                else if (Array.isArray(data.content)) tripsArray = data.content;
                else if (Array.isArray(data.items)) tripsArray = data.items;
                else if (Array.isArray(data.trips)) tripsArray = data.trips;
                else if (Array.isArray(data.results)) tripsArray = data.results;
            }
            
            // Process the trips to ensure all fields are present and format images
            const processedTrips = tripsArray.map(trip => ({
                id: trip.id,
                title: trip.title || 'Unnamed Trip',
                description: trip.description || 'No description',
                location: trip.location || 'Unknown location',
                duration: trip.duration || 'Duration not specified',
                difficulty: trip.difficulty || 'Not specified',
                price: trip.price || 0,
                image: formatImageUrl(trip.image),
                additionalImages: formatAdditionalImages(trip.additionalImages),
                isFavorite: trip.isFavorite || false,
                averageRating: trip.averageRating || 0,
                rating: trip.rating || 0,
                reviewCount: trip.reviewCount || 0,
                participants: trip.participants || trip.capacity || 0
            }));
            
            return processedTrips;
        } catch (error) {
            console.error('Error fetching trips:', error);
            console.error('Error details:', error.message);
            if (error.response) {
                console.error('Error response status:', error.response.status);
                console.error('Error response data:', error.response.data);
            }
            throw error.response?.data || error.message || 'Failed to fetch trips';
        }
    },

    async getTripById(id) {
        try {
            const response = await axios.get(`${API_BASE_URL}/trips/${id}`, {
                headers: getAuthHeader()
            });
            
            // Process the trip data to ensure image URLs are correctly formatted
            const trip = response.data;
            return {
                ...trip,
                image: formatImageUrl(trip.image),
                additionalImages: formatAdditionalImages(trip.additionalImages)
            };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async createTrip(tripData) {
        try {
            // Check if user is admin before making the request
            checkAdminPermission();
            
            const response = await axios.post(`${API_BASE_URL}/trips`, tripData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async updateTrip(id, tripData) {
        try {
            // For updating, we need to distinguish between favorite toggling (allowed for all users)
            // and full trip updates (admin only)
            
            // If only isFavorite is being changed, allow regular users to make the request
            const isOnlyFavoriteToggle = 
                Object.keys(tripData).length === 1 && 'isFavorite' in tripData || 
                (Object.keys(tripData).length === 2 && 'isFavorite' in tripData && 'id' in tripData);
            
            if (!isOnlyFavoriteToggle) {
                checkAdminPermission();
            }
            
            const response = await axios.put(`${API_BASE_URL}/trips/${id}`, tripData, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async deleteTrip(id) {
        try {
            // Check if user is admin before making the request
            checkAdminPermission();
            
            const response = await axios.delete(`${API_BASE_URL}/trips/${id}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Upload main image for a trip
    async uploadMainImage(tripId, imageFile) {
        try {
            checkAdminPermission();
            
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await axios.post(`${API_BASE_URL}/trips/${tripId}/upload-image`, formData, {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Format the image URL in the response
            return {
                ...response.data,
                image: formatImageUrl(response.data.image)
            };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Upload additional images for a trip
    async uploadAdditionalImages(tripId, imageFiles) {
        try {
            checkAdminPermission();
            
            const formData = new FormData();
            for (const file of imageFiles) {
                formData.append('images', file);
            }

            const response = await axios.post(`${API_BASE_URL}/trips/${tripId}/upload-additional-images`, formData, {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Format the image URLs in the response
            return {
                ...response.data,
                additionalImages: formatAdditionalImages(response.data.additionalImages)
            };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Update just the favorite status - allowed for all authenticated users
    async toggleFavorite(id, isFavorite) {
        try {
            console.log(`Setting favorite for trip ${id} to ${isFavorite}`);
            
            // Based on the backend API design, use different methods for adding/removing favorites
            if (isFavorite) {
                // Adding to favorites - use PUT
                const response = await axios.put(
                    `${API_BASE_URL}/trips/${id}/favorite`, 
                    {}, // No body needed as per the backend API
                    { headers: getAuthHeader() }
                );
                console.log('Add to favorites response:', response.data);
                return response.data;
            } else {
                // Removing from favorites - use DELETE
                const response = await axios.delete(
                    `${API_BASE_URL}/trips/${id}/favorite`,
                    { headers: getAuthHeader() }
                );
                console.log('Remove from favorites response:', response.data);
                return response.data;
            }
        } catch (error) {
            console.error('Error setting favorite status:', error);
            console.error('Error details:', error.message);
            if (error.response) {
                console.error('Error response status:', error.response.status);
                console.error('Error response data:', error.response.data);
            }
            
            // Even if the API call fails, return an object that matches expected structure
            // for UI optimistic updates
            return { 
                message: isFavorite ? "Failed to add to favorites" : "Failed to remove from favorites",
                isFavorite: isFavorite
            };
        }
    }
};

export default tripService; 