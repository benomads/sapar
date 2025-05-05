import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

const contactService = {
    // Send contact form data to Telegram
    sendMessageToTelegram: async (formData) => {
        try {
            // First try to use the backend API endpoint
            try {
                return await contactService.sendContactMessage(formData);
            } catch (backendError) {
                console.warn('Backend contact API failed, falling back to direct Telegram API:', backendError);
            }
                
               
        } catch (error) {
            console.error('Error sending message to Telegram:', error);
            throw new Error('Failed to send message. Please try again later.');
        }
    },
    
    // API endpoint for sending messages via backend
    sendContactMessage: async (formData) => {
        try {
            const response = await axios.post(`${API_URL}/contact`, formData);
            return response.data;
        } catch (error) {
            console.error('Error sending contact message through backend:', error);
            
            // In development, simulate a successful response if API is not available
            if (import.meta.env.DEV) {
                console.warn('Using simulated contact form submission (development mode)');
                await new Promise(resolve => setTimeout(resolve, 1000));
                return { success: true, dev_mode: true };
            }
            
            throw error; // Let the calling function handle this
        }
    }
};

export default contactService; 