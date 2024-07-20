import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const register = (email: string, password: string, confirmPassword: string) => {
    return axios.post(`${API_URL}/register`, { email, password, confirmPassword });
};

const login = (email: string, password: string) => {
    return axios.post(`${API_URL}/login`, { email, password });
};

const logout = async () => {
    try {
        await axios.post(`${API_URL}/logout`);
    } catch (error) {
        console.error("Logout failed:", error);
        throw error; // Optionally re-throw the error to handle it in the component
    }
};

export { register, login, logout };