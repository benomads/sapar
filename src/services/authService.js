import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const authService = {
    async login(email, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async register(name, email, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, {
                name,
                email,
                password
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default authService; 