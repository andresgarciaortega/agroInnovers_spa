
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Menu from "./components/Menu";
import './app.css'
import AuthLogin from './pages/auth/login';
import { BrowserRouter } from 'react-router-dom';


const App = () => {
  return (
    <BrowserRouter>
        {/* <AuthLogin/> */}
        <AppRoutes /> {/* Todas tus rutas */}
    </BrowserRouter>
  );
};

export default App;
