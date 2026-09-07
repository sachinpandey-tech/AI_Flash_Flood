import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import DemoWatermark from './components/common/DemoWatermark';
import SimulationController from './components/simulation/SimulationController';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import VillageDetails from './pages/VillageDetails';
import Predictions from './pages/Predictions';
import Sensors from './pages/Sensors';
import Alerts from './pages/Alerts';
import Villages from './pages/Villages';
import HistoricalEvents from './pages/HistoricalEvents';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import CitizenView from './pages/CitizenView';

// Protected operator layout
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Citizen view and Login have their own custom layouts
  const isStandalone = location.pathname === '/citizen' || location.pathname === '/login';

  if (isStandalone) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/citizen" element={<CitizenView />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top persistent Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

      <div className="flex-1 flex">
        {/* Persistent Collapsible Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:ml-64 max-w-7xl w-full mx-auto pb-28">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<LiveRiskMapPage />} />
            <Route path="/villages" element={<Villages />} />
            <Route path="/villages/:id" element={<VillageDetails />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/historical" element={<HistoricalEvents />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Floating Flash Flood Simulation HUD (Active in Demo Mode) */}
      <SimulationController />

      {/* Simulated Demo Data Footnote Watermark */}
      <div className="md:pl-64">
        <DemoWatermark />
      </div>

    </div>
  );
}

// Alias for /map route to match LiveMap import
function LiveRiskMapPage() {
  return <LiveMap />;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
