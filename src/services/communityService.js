import axios from 'axios';

// Use import.meta.env for Vite environment variables instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

class CommunityService {
    constructor() {
        this.token = localStorage.getItem('token');
    }
    
    // Helper method to get latest auth header
    getAuthHeader() {
        this.token = localStorage.getItem('token');
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }

    async getAllCommunities() {
        try {
            // Use the real backend endpoint
            const response = await axios.get(`${API_URL}/communities`, { 
                headers: this.getAuthHeader() 
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching communities:', error);
            
            // For development/fallback, return mock data if backend is unavailable
            if (!API_URL.includes('localhost')) {
                throw error;
            }
            console.warn('Using mock data as fallback');
            return this.getMockCommunities();
        }
    }
    
    async getCommunityById(id) {
        try {
            const response = await axios.get(`${API_URL}/communities/${id}`, { 
                headers: this.getAuthHeader() 
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching community with id ${id}:`, error);
            
            // For development/fallback
            if (!API_URL.includes('localhost')) {
                throw error;
            }
            console.warn('Using mock data as fallback');
            const communities = this.getMockCommunities();
            return communities.find(community => community.id === id);
        }
    }
    
    async getCommunityByCategory(category) {
        try {
            const response = await axios.get(`${API_URL}/communities/category/${category}`, { 
                headers: this.getAuthHeader() 
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching communities with category ${category}:`, error);
            throw error;
        }
    }
    
    async joinCommunity(communityId) {
        try {
            const response = await axios.post(
                `${API_URL}/communities/${communityId}/join`, 
                {}, 
                { headers: this.getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error(`Error joining community with id ${communityId}:`, error);
            throw error;
        }
    }
    
    async leaveCommunity(communityId) {
        try {
            const response = await axios.post(
                `${API_URL}/communities/${communityId}/leave`, 
                {}, 
                { headers: this.getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error(`Error leaving community with id ${communityId}:`, error);
            throw error;
        }
    }
    
    async createCommunity(communityData) {
        try {
            const response = await axios.post(
                `${API_URL}/communities`, 
                communityData, 
                { headers: this.getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating community:', error);
            throw error;
        }
    }
    
    async updateCommunity(communityId, communityData) {
        try {
            const response = await axios.put(
                `${API_URL}/communities/${communityId}`, 
                communityData, 
                { headers: this.getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error(`Error updating community with id ${communityId}:`, error);
            throw error;
        }
    }
    
    async deleteCommunity(communityId) {
        try {
            await axios.delete(
                `${API_URL}/communities/${communityId}`, 
                { headers: this.getAuthHeader() }
            );
            return true;
        } catch (error) {
            console.error(`Error deleting community with id ${communityId}:`, error);
            throw error;
        }
    }
    
    async getCreatedCommunities() {
        try {
            const response = await axios.get(
                `${API_URL}/communities/created`, 
                { headers: this.getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching created communities:', error);
            throw error;
        }
    }
    
    async getJoinedCommunities() {
        try {
            const response = await axios.get(
                `${API_URL}/communities/joined`, 
                { headers: this.getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching joined communities:', error);
            throw error;
        }
    }
}

export default new CommunityService(); 