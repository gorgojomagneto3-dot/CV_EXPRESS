import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario guardado en localStorage
    const savedUser = localStorage.getItem('cv_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('cv_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (googleUserData) => {
    try {
      // Enviar a backend para registrar/autenticar
      const response = await apiService.authWithGoogle(googleUserData);
      
      const userData = {
        ...response.user,
        mongoId: response.user.id,
        token: googleUserData.token,
        isPremium: response.user.isPremium || false,
        daysRemaining: response.user.daysRemaining || 0,
        premiumExpiresAt: response.user.premiumExpiresAt || null
      };

      setUser(userData);
      localStorage.setItem('cv_user', JSON.stringify(userData));
      
      return { success: true, isNewUser: response.isNewUser };
    } catch (error) {
      console.error('Error en login:', error);
      // Fallback: guardar solo datos de Google si el backend falla
      setUser(googleUserData);
      localStorage.setItem('cv_user', JSON.stringify(googleUserData));
      return { success: true, isNewUser: false };
    }
  };

  const updateUserPaymentStatus = (paymentInfo) => {
    if (user) {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const updatedUser = { 
        ...user, 
        hasPaid: true,
        isPremium: true,
        premiumExpiresAt: expiresAt.toISOString(),
        daysRemaining: 7
      };
      setUser(updatedUser);
      localStorage.setItem('cv_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cv_user');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUserPaymentStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
