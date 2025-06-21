import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
    baseURL: 'http://localhost:5242/api',
});

// Dodawanie tokena do ka¿dego zapytania
API.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    console.log('DO£¥CZONY TOKEN:', token); // <-- dodaj to
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default API;
