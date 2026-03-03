import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [sidebarAberta, setSidebarAberta] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onToggleSidebar={() => setSidebarAberta((v) => !v)} />
      <Sidebar aberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />

      {/* Conteúdo principal */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
