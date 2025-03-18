
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import { CompanyProvider } from './context/CompanyContext';


const App = () => {
  return (
    <CompanyProvider>
      <BrowserRouter>
        <AppRoutes /> 
      </BrowserRouter>
    </CompanyProvider>
  );
};

export default App;
