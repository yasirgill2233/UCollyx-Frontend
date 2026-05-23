import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
});

API.interceptors.request.use((req) => {
    const tokenData = localStorage.getItem('token'); // Get as string
    
    if (tokenData) {
        try {
            // Naye hook ki wajah se data "JSON string" hai, isay parse krna lazmi hai
            const token = JSON.parse(tokenData); 
            req.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
            // Agar kabhi parsing fail ho jaye (purana plain string data)
            req.headers.Authorization = `Bearer ${tokenData}`;
        }
    }
    return req;
});

export default API;