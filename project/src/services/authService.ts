import axios from 'axios';

const API_URL = 'http://localhost:3000'; 
// This will be proxied to the backend in development
axios.defaults.withCredentials = true;

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

const setToken = (token: string) => {
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const removeToken = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};

// Initialize axios with token if it exists
const initializeAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

initializeAuth();

const login = async (email: string, password: string): Promise<User> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, { email, password });
  setToken(response.data.token);
  return response.data.user;
};

const signup = async (name: string, email: string, password: string): Promise<User> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, { name, email, password });
  setToken(response.data.token);
  return response.data.user;
};

const getCurrentUser = async (): Promise<User | null> => {
  // Check for token
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const response = await axios.get<User>(`${API_URL}/user/profile`);
    return response.data;
  } catch {
    removeToken();
    return null;
  }
};

const logout = () => {
  removeToken();
};

export const authService = {
  login,
  signup,
  logout,
  getCurrentUser,
};