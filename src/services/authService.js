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
    },


    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const payload = JSON.parse(jsonPayload);
            console.log('JWT payload:', payload);
            return payload;
        } catch (error) {
            console.error('Error parsing JWT token:', error);
            return null;
        }
    },

    getCurrentUser() {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        return this.parseJwt(token);
    },

    isAdmin() {
        const storedRole = localStorage.getItem('userRole');
        console.log('Stored user role:', storedRole);
        if (storedRole && (storedRole.includes('ADMIN') || storedRole.includes('ROLE_ADMIN'))) {
            return true;
        }
        
        const user = this.getCurrentUser();
        console.log('Checking isAdmin for user:', user);
        
        if (!user) return false;
        
        const checkForAdmin = (obj) => {
            if (!obj) return false;
            
            if (Array.isArray(obj.roles)) {
                return obj.roles.includes('ADMIN') || obj.roles.includes('ROLE_ADMIN');
            }
            
            if (typeof obj.roles === 'string') {
                return obj.roles === 'ADMIN' || obj.roles === 'ROLE_ADMIN';
            }
            
            if (Array.isArray(obj.role)) {
                return obj.role.includes('ADMIN') || obj.role.includes('ROLE_ADMIN');
            }
            
            if (typeof obj.role === 'string') {
                return obj.role === 'ADMIN' || obj.role === 'ROLE_ADMIN';
            }
            
            if (Array.isArray(obj.authorities)) {
                return obj.authorities.some(auth => 
                    auth === 'ADMIN' || 
                    auth === 'ROLE_ADMIN' || 
                    (auth.authority && (auth.authority === 'ADMIN' || auth.authority === 'ROLE_ADMIN'))
                );
            }
            
            return false;
        };
        
        if (checkForAdmin(user)) return true;
        
        if (user.user && checkForAdmin(user.user)) return true;
        if (user.data && checkForAdmin(user.data)) return true;
        
        return false;
    },
    
    // Check if current user is manager
    isManager() {
        // Check for manually stored userRole in localStorage (debugging purpose)
        const storedRole = localStorage.getItem('userRole');
        console.log('Stored user role:', storedRole);
        if (storedRole && (storedRole.includes('MANAGER') || storedRole.includes('ROLE_MANAGER'))) {
            return true;
        }
        
        const user = this.getCurrentUser();
        console.log('Checking isManager for user:', user);
        
        if (!user) return false;
        
        // Handle different possible formats for roles in JWT token
        const checkForManager = (obj) => {
            if (!obj) return false;
            
            // Check if roles is an array
            if (Array.isArray(obj.roles)) {
                return obj.roles.includes('MANAGER') || obj.roles.includes('ROLE_MANAGER');
            }
            
            // Check if roles is a string
            if (typeof obj.roles === 'string') {
                return obj.roles === 'MANAGER' || obj.roles === 'ROLE_MANAGER';
            }
            
            // Check if role property exists (singular)
            if (Array.isArray(obj.role)) {
                return obj.role.includes('MANAGER') || obj.role.includes('ROLE_MANAGER');
            }
            
            // Check if role is a string
            if (typeof obj.role === 'string') {
                return obj.role === 'MANAGER' || obj.role === 'ROLE_MANAGER';
            }
            
            // Check if authorities property exists (Spring Security format)
            if (Array.isArray(obj.authorities)) {
                return obj.authorities.some(auth => 
                    auth === 'MANAGER' || 
                    auth === 'ROLE_MANAGER' || 
                    (auth.authority && (auth.authority === 'MANAGER' || auth.authority === 'ROLE_MANAGER'))
                );
            }
            
            return false;
        };
        
        // Check directly in user object
        if (checkForManager(user)) return true;
        
        // Some JWT tokens might have user info nested in different properties
        if (user.user && checkForManager(user.user)) return true;
        if (user.data && checkForManager(user.data)) return true;
        
        // Admins should also have manager privileges
        if (this.isAdmin()) return true;
        
        return false;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
    }
};

export default authService;

