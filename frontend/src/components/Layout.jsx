import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [sidebarAberta, setSidebarAberta] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar aberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} />
      <Header onToggleSidebar={() => setSidebarAberta((v) => !v)} />
      <main className="pt-16 lg:pl-60 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
