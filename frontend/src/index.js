import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './pages/home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientsControl from './pages/clients';
import CarsControl from './pages/cars';
import Location from './pages/location';
import EntregaVeiculo from './pages/entrega';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          } />
          <Route path='/clients' element={
            <ProtectedRoute>
              <ClientsControl />
            </ProtectedRoute>
          } />
          <Route path='/cars' element={
            <ProtectedRoute>
              <CarsControl />
            </ProtectedRoute>
          } />
          <Route path='/location' element={
            <ProtectedRoute>
              <Location />
            </ProtectedRoute>
          } />
          <Route path='/entrega/:idLocacao' element={
            <ProtectedRoute>
              <EntregaVeiculo />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);