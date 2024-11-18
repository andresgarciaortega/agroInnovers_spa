
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Menu from "./components/Menu";
import AuthLogin from './pages/auth/login';
import { BrowserRouter } from 'react-router-dom';
import { CompanyProvider } from './context/CompanyContext';


const App = () => {
  return (
    <CompanyProvider>
      <BrowserRouter>
        {/* <AuthLogin/> */}
        <AppRoutes /> {/* Todas tus rutas */}
      </BrowserRouter>
    </CompanyProvider>
  );
};

export default App;
