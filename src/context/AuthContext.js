import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Login unificado para email y Google
  const login = async (userData, authProvider = 'google') => {
    try {
      const userToSave = {
        ...userData,
        mongoId: userData.mongoId || userData.id,
        isPremium: userData.isPremium || false,
        daysRemaining: userData.daysRemaining || 0,
        premiumExpiresAt: userData.premiumExpiresAt || null,
        authProvider: authProvider
      };

      setUser(userToSave);
      localStorage.setItem('cv_user', JSON.stringify(userToSave));
      
      return { success: true, isNewUser: userData.isNewUser || false };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
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
