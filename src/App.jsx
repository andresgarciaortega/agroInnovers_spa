
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import { CompanyProvider } from './context/CompanyContext';
import useDataSync from './store/asyncDataCronJobs';


const App = () => {
  // useDataSync(); // Activamos la lógica de sincronización

  return (
    <CompanyProvider>
      <BrowserRouter>
        <AppRoutes /> 
      </BrowserRouter>
    </CompanyProvider>
  );
};

export default App;
