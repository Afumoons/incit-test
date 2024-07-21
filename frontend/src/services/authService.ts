import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL;

// Set up axios interceptor to include token in headers
axios.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const register = (email: string, password: string, confirmPassword: string) => {
    return axios.post(`${API_URL}/register`, { email, password, confirmPassword });
};

export const verifyEmail = (token: string) => {
    return axios.get(`${API_URL}/verify-email`, { params: { token } });
};

export const resendVerificationEmail = (email: string | undefined) => {
    return axios.post(`${API_URL}/resend-verification-email`, { email });
};

export const login = (email: string, password: string) => {
    return axios.post(`${API_URL}/login`, { email, password });
};

export const logout = (email: string | undefined) => {
    return axios.post(`${API_URL}/logout`, { email });
};

export const getAllUsers = () => {
    return axios.get(`${API_URL}/users`);
};

export const getDashboardStatistics = () => {
    return axios.get(`${API_URL}/dashboard-statistic`);
};

export const getProfileData = (email: string | undefined) => {
    return axios.post(`${API_URL}/get-profile`, { email });
};

export const changeProfile = (email: string | undefined, name: string) => {
    return axios.put(`${API_URL}/change-profile`, { email, name });
};

export const changePassword = (email: string | undefined, oldPassword: string, newPassword: string) => {
    return axios.put(`${API_URL}/change-password`, { email, oldPassword, newPassword });
};
