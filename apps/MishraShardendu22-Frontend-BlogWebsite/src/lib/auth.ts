import { writable } from 'svelte/store';
import type { User, ApiError } from './api';
import { authApi } from './api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Token expiry check (optional enhancement)
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch {
    return true; // If we can't parse, consider it expired
  }
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    
    // Initialize auth state from localStorage
    init: async () => {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        // Check if token is expired
        if (isTokenExpired(token)) {
          console.warn('Token expired, clearing auth state');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          update(state => ({ ...state, isLoading: false, error: 'Session expired' }));
          return;
        }

        try {
          const user = JSON.parse(userStr);
          update(state => ({
            ...state,
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          }));
          
          // Verify token with backend
          try {
            const response = await authApi.getCurrentUser();
            if (response.success && response.data) {
              update(state => ({
                ...state,
                user: response.data!.user,
                error: null,
              }));
            }
          } catch (error: any) {
            console.error('Failed to verify token:', error);
            // Token might be invalid, clear it
            if (error.statusCode === 401) {
              authStore.logout();
            }
          }
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          update(state => ({ 
            ...state, 
            isLoading: false,
            error: 'Invalid stored session'
          }));
        }
      } else {
        update(state => ({ ...state, isLoading: false }));
      }
    },
    
    // Login
    login: async (email: string, password: string) => {
      try {
        const response = await authApi.login(email, password);
        
        if (response.success && response.data) {
          const { token, user } = response.data;
          
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          update(state => ({
            ...state,
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          }));
          
          return { success: true, user };
        }
        
        return { success: false, error: response.error || 'Login failed' };
      } catch (error: any) {
        console.error('Login error:', error);
        return { success: false, error: error.message || 'Login failed' };
      }
    },
    
    // Register
    register: async (email: string, password: string, name: string) => {
      try {
        const response = await authApi.register(email, password, name);
        
        if (response.success && response.data) {
          const { token, user } = response.data;
          
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          update(state => ({
            ...state,
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          }));
          
          return { success: true, user, message: response.message };
        }
        
        return { success: false, error: response.error || 'Registration failed' };
      } catch (error: any) {
        console.error('Registration error:', error);
        return { success: false, error: error.message || 'Registration failed' };
      }
    },
    
    // Verify OTP
    verifyOTP: async (email: string, otp: string) => {
      try {
        const response = await authApi.verifyOTP(email, otp);
        
        if (response.success && response.data) {
          const { user } = response.data;
          
          localStorage.setItem('user', JSON.stringify(user));
          
          update(state => ({
            ...state,
            user,
          }));
          
          return { success: true };
        }
        
        return { success: false, error: response.error || 'OTP verification failed' };
      } catch (error: any) {
        console.error('OTP verification error:', error);
        return { success: false, error: error.message || 'OTP verification failed' };
      }
    },
    
    // Logout
    logout: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      // Redirect to login
      window.location.href = '/login';
    },
    
    // Update user
    updateUser: (user: User) => {
      localStorage.setItem('user', JSON.stringify(user));
      update(state => ({ ...state, user }));
    },
  };
}

export const authStore = createAuthStore();
