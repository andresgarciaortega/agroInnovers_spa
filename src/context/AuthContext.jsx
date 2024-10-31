import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Cambia esto según tu lógica de autenticación

  const login = () => {
    setIsAuthenticated(true); // Lógica de inicio de sesión
  };

  const logout = () => {
    setIsAuthenticated(false); // Lógica de cierre de sesión
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
