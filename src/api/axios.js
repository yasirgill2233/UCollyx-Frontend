import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL+'/api', // Aapka backend URL
});

// Ye interceptor har request se pehle check karega ke agar localStorage mein token hai to bhej do
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;