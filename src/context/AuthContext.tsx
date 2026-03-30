// ================ Auth Context ================

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '../services/api';
import type { User } from '../types/models';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ================ Initialize Auth ================
  useEffect(() => {
    const savedToken = localStorage.getItem('userToken');
    if (savedToken) {
      setToken(savedToken);
      // Optionally verify token here
      authAPI.verifyToken()
        .then(() => {
          // Token is valid
          setIsLoading(false);
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('userToken');
          setToken(null);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // ================ Login Logic ================
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.token) {
        localStorage.setItem('userToken', response.token);
        setToken(response.token);
        setUser(response.user);
        
        // Show success message
        toast.success('Login successful! Welcome back!');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error cases
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('401') || error.message.includes('incorrect') || error.message.includes('Invalid')) {
          errorMessage = 'Incorrect email or password';
        } else if (error.message.includes('404') || error.message.includes('not found')) {
          errorMessage = 'Account not found. Please check your email or register.';
        } else if (error.message.includes('400') || error.message.includes('bad request')) {
          errorMessage = 'Invalid request. Please check your input.';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Show error message
      toast.error(errorMessage);
      
      throw error;
    }
  };

  // ================ Register Logic ================
  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data);
      
      if (response.token) {
        localStorage.setItem('userToken', response.token);
        setToken(response.token);
        setUser(response.user);
        
        // Show success message
        toast.success('Account created successfully! Welcome to E-Shop!');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      
      // Handle specific error cases
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('409') || error.message.includes('already exists') || error.message.includes('duplicate')) {
          errorMessage = 'Account already exists. Please use a different email or login.';
        } else if (error.message.includes('400') || error.message.includes('bad request') || error.message.includes('validation')) {
          errorMessage = 'Invalid input. Please check all fields and try again.';
        } else if (error.message.includes('email') && error.message.includes('invalid')) {
          errorMessage = 'Invalid email format. Please enter a valid email address.';
        } else if (error.message.includes('password') && error.message.includes('short')) {
          errorMessage = 'Password is too short. Please use at least 6 characters.';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Show error message
      toast.error(errorMessage);
      
      throw error;
    }
  };

  // ================ Logout Logic ================
  const logout = () => {
    localStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
