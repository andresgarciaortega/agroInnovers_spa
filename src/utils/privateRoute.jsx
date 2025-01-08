import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("authToken")); // Verifica si hay un token o un indicador de autenticación

  return isAuthenticated ? children : <Navigate to="/" />;
};
 
export default PrivateRoute;
