import axios from 'axios';

const API_URL = '/api'; // This will be proxied to the backend in development

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
  try {
    // This will call the backend when it's set up
    // For now, we'll use a mock implementation
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, { email, password });
    setToken(response.data.token);
    return response.data.user;
  } catch (error) {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock login in development mode');
      const mockUser = { id: '1', email, name: 'Demo User' };
      setToken('mock-token');
      return mockUser;
    }
    throw error;
  }
};

const signup = async (name: string, email: string, password: string): Promise<User> => {
  try {
    // This will call the backend when it's set up
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, { name, email, password });
    setToken(response.data.token);
    return response.data.user;
  } catch (error) {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock signup in development mode');
      const mockUser = { id: '1', email, name };
      setToken('mock-token');
      return mockUser;
    }
    throw error;
  }
};

const getCurrentUser = async (): Promise<User | null> => {
  // Check for token
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // This will call the backend when it's set up
    const response = await axios.get<User>(`${API_URL}/me`);
    return response.data;
  } catch {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock user in development mode');
      return { id: '1', email: 'demo@example.com', name: 'Demo User' };
    }
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