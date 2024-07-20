import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const register = (email: string, password: string, confirmPassword: string) => {
    return axios.post(`${API_URL}/register`, { email, password, confirmPassword });
};

const login = (email: string, password: string) => {
    return axios.post(`${API_URL}/login`, { email, password });
};

const logout = (email: string | undefined) => {
    return axios.post(`${API_URL}/logout`, { email });
};

const getAllUsers = () => {
    return axios.get(`${API_URL}/users`);
};

const getDashboardStatistics = () => {
    return axios.get(`${API_URL}/dashboard-statistic`);
};

export { register, login, logout, getAllUsers, getDashboardStatistics };