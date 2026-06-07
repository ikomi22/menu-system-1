/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Tablet, 
  Settings as SettingsIcon, 
  Clock,
  Wifi,
  WifiOff,
  RotateCcw,
  Maximize2,
  Minimize2,
  CheckCircle,
  Eye,
  Crown
} from 'lucide-react';
import { MenuItem, RestaurantConfig } from './types';
import { DEFAULT_MENU_ITEMS, DEFAULT_CONFIG } from './data';
import CustomerApp from './components/CustomerApp';
import AdminPanel from './components/AdminPanel';

type ViewMode = 'customer' | 'admin';

export default function App() {
  // Sync state with localStorage to support offline-first behaviors and active sessions
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('vms_menu_items');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_MENU_ITEMS;
  });

  const [config, setConfig] = useState<RestaurantConfig>(() => {
    const saved = localStorage.getItem('vms_restaurant_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_CONFIG;
  });

  const [isOffline, setIsOffline] = useState<boolean>(() => {
    const saved = localStorage.getItem('vms_offline');
    return saved === 'true';
  });

  // Default directly to customer menu view as it is the primary focus of the tablet menu system
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  
  // Choose between presenting the tablet inside a simulated portrait shell vs full screen
  const [isFramed, setIsFramed] = useState<boolean>(true);
  
  // Custom setting: speeds up the inactivity timer on Kiosk mode to 15s instead of 3m for easy demo
  const [testInactivitySpeed, setTestInactivitySpeed] = useState<boolean>(false);

  // Write changes back to localStorage
  useEffect(() => {
    localStorage.setItem('vms_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('vms_restaurant_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('vms_offline', String(isOffline));
  }, [isOffline]);

  // Handle database operations
  const handleAddMenuItem = (newItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: MenuItem = {
      ...newItem,
      id: `m-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setMenuItems(prev => [item, ...prev]);
    
    // Auto update config sync timestamp
    setConfig(prev => ({
      ...prev,
      lastUpdated: Date.now()
    }));
  };

  const handleUpdateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...updates,
          updatedAt: Date.now()
        };
      }
      return item;
    }));

    setConfig(prev => ({
      ...prev,
      lastUpdated: Date.now()
    }));
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    
    setConfig(prev => ({
      ...prev,
      lastUpdated: Date.now()
    }));
  };

  const handleUpdateConfig = (updates: Partial<RestaurantConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates,
      lastUpdated: Date.now()
    }));
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all menu items and branding back to default? All custom edits will be deleted.')) {
      setMenuItems(DEFAULT_MENU_ITEMS);
      setConfig(DEFAULT_CONFIG);
      setIsOffline(false);
      localStorage.removeItem('vms_menu_items');
      localStorage.removeItem('vms_restaurant_config');
      localStorage.removeItem('vms_offline');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-slate-100 font-sans flex flex-col justify-between">
      
      {/* EXQUISITE PRODUCT DESIGN SELECTOR BAR */}
      <header className="bg-[#121212]/90 backdrop-blur-md border-b border-white/5 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 select-none z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C9A84C] to-[#E8B84B] text-slate-900 font-serif font-black flex items-center justify-center text-sm shadow-lg shadow-[#C9A84C]/10">
            É
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-display font-medium tracking-widest text-[#C9A84C] uppercase">
                {config.name}
              </h1>
              <span className="text-[9px] uppercase font-bold tracking-widest bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-1.5 py-0.5 rounded text-[#C9A84C] flex items-center gap-0.5">
                <Crown className="w-2.5 h-2.5" />
                Premium Menu Kiosk
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-sans font-light block mt-0.5">
              Live tablet experience & branding manager configuration console
            </span>
          </div>
        </div>

        {/* MODE SWITCHER */}
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
          <button
            id="switch-customer-mode-btn"
            onClick={() => setViewMode('customer')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all duration-300 ${
              viewMode === 'customer'
                ? 'bg-zinc-800 text-[#C9A84C] shadow-md border border-white/5'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Customer Tablet view</span>
          </button>
          
          <button
            id="switch-admin-mode-btn"
            onClick={() => setViewMode('admin')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all duration-300 ${
              viewMode === 'admin'
                ? 'bg-zinc-800 text-[#C9A84C] shadow-md border border-white/5'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </button>
        </div>

        {/* PREVIEW CONTROLS */}
        <div className="flex items-center gap-3">
          {viewMode === 'customer' && (
            <button
              id="toggle-framed-btn"
              onClick={() => setIsFramed(!isFramed)}
              title={isFramed ? 'Switch to true full-screen mode' : 'Switch back to simulated tablet frame'}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-xs text-neutral-300 rounded-lg border border-white/5 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isFramed ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Full Device Screen</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Simulated Mockup</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleResetData}
            title="Reset menu recipes to default system presets"
            className="p-2 bg-zinc-900 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/40 text-neutral-400 rounded-lg border border-white/5 transition-all text-xs flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[10px] uppercase font-bold tracking-wider">Reset Menu</span>
          </button>
        </div>
      </header>

      {/* Dynamic Screen View Mode Rendering */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <AnimatePresence mode="wait">
          
          {/* STATE 1: GUEST TABLET MENU EXPERIENCE */}
          {viewMode === 'customer' && (
            <motion.div 
              key="customer-tablet-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {isFramed ? (
                /* SIMULATED TABLET FRAME ENVIRONMENT WITH GORGEOUS ROOM BACKDROP */
                <div className="flex-1 flex flex-col justify-center items-center py-6 px-4 bg-gradient-to-b from-[#141414] to-[#0A0A0A] relative overflow-hidden">
                  
                  {/* Subtle luxurious restaurant environment backdrop overlay */}
                  <div className="absolute inset-0 opacity-[0.14] pointer-events-none bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&auto=format&fit=crop&q=80')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                  {/* Tablet Frame */}
                  <div className="w-full max-w-[850px] aspect-[10.5/7.2] bg-slate-950 border-[16px] border-zinc-900 rounded-[42px] shadow-[0_35px_80px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-row p-0.5 select-none animate-fade-in-up">
                    
                    {/* Speaker mesh/sensor bar at left side when landscape */}
                    <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-neutral-800 rounded-full z-40 hidden md:block" />
                    
                    {/* Camera hole on right side when landscape */}
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-neutral-800 rounded-full z-40 hidden md:block" />

                    {/* Active Tablet screen */}
                    <div className="flex-1 w-full h-full bg-[#1A1A1A] overflow-hidden rounded-[24px] relative border border-white/5">
                      <CustomerApp
                        menuItems={menuItems}
                        config={config}
                        isOffline={isOffline}
                        testInactivitySpeed={testInactivitySpeed}
                      />
                    </div>
                  </div>

                  {/* Quick Device Hint */}
                  <div className="mt-4 flex items-center gap-3.5 text-xs text-neutral-400 z-10 bg-black/55 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>Tablet Simulator Mode Active</span>
                    </span>
                    <span className="text-zinc-600">|</span>
                    <button
                      onClick={() => setIsFramed(false)}
                      className="text-[#C9A84C] hover:text-[#ecd28c] font-semibold underline cursor-pointer"
                    >
                      Maximize to Full Device Screen
                    </button>
                  </div>
                </div>
              ) : (
                /* TRUE FULL-SCREEN VIEWPORT MODE DESIGNED SPECIFICALLY FOR GENUINE TABLET TESTERS */
                <div className="flex-1 w-full relative bg-[#1A1A1A] overflow-hidden">
                  <CustomerApp
                    menuItems={menuItems}
                    config={config}
                    isOffline={isOffline}
                    testInactivitySpeed={testInactivitySpeed}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* STATE 2: MANAGER ADMIN PROCESS console */}
          {viewMode === 'admin' && (
            <motion.div
              key="admin-console-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1 bg-slate-50 min-h-0 text-slate-800 overflow-y-auto"
            >
              {/* Admin panel dashboard rendered in viewport */}
              <AdminPanel
                menuItems={menuItems}
                onAddMenuItem={handleAddMenuItem}
                onUpdateMenuItem={handleUpdateMenuItem}
                onDeleteMenuItem={handleDeleteMenuItem}
                config={config}
                onUpdateConfig={handleUpdateConfig}
                isOffline={isOffline}
                onToggleOffline={() => setIsOffline(!isOffline)}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0A0A0A] border-t border-white/5 px-6 py-4 text-center select-none text-[11px] text-neutral-500 shrink-0 font-light font-sans flex flex-col md:flex-row justify-between items-center gap-2">
        <span>L'Étoile Dorée Luxury Menu Kiosk System © 2026. Designed for bespoke hospitality tablet grids.</span>
        <div className="flex gap-4 items-center">
          <span className="text-neutral-600">|</span>
          <span className="text-[#C9A84C]/80 font-mono tracking-wider">
            All Real-Time Database State Localized & Synced
          </span>
        </div>
      </footer>

    </div>
  );
}

