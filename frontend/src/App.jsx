import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Rota protegida: redireciona para /login se não autenticado
const RotaProtegida = ({ children }) => {
  const { token, inicializando } = useAuth();

  if (inicializando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-neutral-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
};

// Rota pública: redireciona para /dashboard se já autenticado
const RotaPublica = ({ children }) => {
  const { token, inicializando } = useAuth();
  if (inicializando) return null;
  return token ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RotaPublica>
            <LoginPage />
          </RotaPublica>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RotaProtegida>
            <Layout>
              <DashboardPage />
            </Layout>
          </RotaProtegida>
        }
      />
      {/* Sprint 3+ */}
      <Route
        path="/acolhidos"
        element={
          <RotaProtegida>
            <Layout>
              <div className="card">
                <h1 className="text-2xl font-bold text-neutral-900 mb-2">Acolhidos</h1>
                <p className="text-neutral-500">Módulo disponível na Sprint 3.</p>
              </div>
            </Layout>
          </RotaProtegida>
        }
      />
      <Route
        path="/usuarios"
        element={
          <RotaProtegida>
            <Layout>
              <div className="card">
                <h1 className="text-2xl font-bold text-neutral-900 mb-2">Usuários</h1>
                <p className="text-neutral-500">Módulo disponível na Sprint 3.</p>
              </div>
            </Layout>
          </RotaProtegida>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
