import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AcolhidosPage from './pages/AcolhidosPage';
import NovoAcolhidoPage from './pages/NovoAcolhidoPage';
import EditarAcolhidoPage from './pages/EditarAcolhidoPage';
import DetalhesAcolhidoPage from './pages/DetalhesAcolhidoPage';
import UsuariosPage from './pages/UsuariosPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import EvolucaosPage from './pages/EvolucaosPage';
import RelatoriosPage from './pages/RelatoriosPage';
import NotFoundPage from './pages/NotFoundPage';

const RotaProtegida = ({ children }) => {
  const { token, inicializando } = useAuth();
  if (inicializando) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full" />
    </div>
  );
  return token ? children : <Navigate to="/login" replace />;
};

const RotaPublica = ({ children }) => {
  const { token, inicializando } = useAuth();
  if (inicializando) return null;
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const Pagina = ({ children }) => (
  <RotaProtegida><Layout>{children}</Layout></RotaProtegida>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<RotaPublica><LoginPage /></RotaPublica>} />
      <Route path="/dashboard" element={<Pagina><DashboardPage /></Pagina>} />
      <Route path="/acolhidos" element={<Pagina><AcolhidosPage /></Pagina>} />
      <Route path="/acolhidos/novo" element={<Pagina><NovoAcolhidoPage /></Pagina>} />
      <Route path="/acolhidos/:id" element={<Pagina><DetalhesAcolhidoPage /></Pagina>} />
      <Route path="/acolhidos/:id/editar" element={<Pagina><EditarAcolhidoPage /></Pagina>} />
      <Route path="/evolucoes" element={<Pagina><EvolucaosPage /></Pagina>} />
      <Route path="/relatorios" element={<Pagina><RelatoriosPage /></Pagina>} />
      <Route path="/usuarios" element={<Pagina><UsuariosPage /></Pagina>} />
      <Route path="/configuracoes" element={<Pagina><ConfiguracoesPage /></Pagina>} />
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
