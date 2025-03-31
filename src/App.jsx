import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import { CompanyProvider } from './context/CompanyContext';
import useDataSync from './store/asyncDataCronJobs';

const App = () => {
  return (
    <CompanyProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CompanyProvider>
  );
};

// Componente interno que usa el hook
const AppContent = () => {
  useDataSync();
  return <AppRoutes />;
};

export default App;