/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RotateCcw, Crown } from 'lucide-react';
import { MenuItem, RestaurantConfig } from './types';
import { DEFAULT_MENU_ITEMS, DEFAULT_CONFIG } from './data';
import CustomerApp from './components/CustomerApp';
import AdminPanel from './components/AdminPanel';

type ViewMode = 'admin' | 'kiosk';

// Bump this when menu source data changes to force a localStorage refresh
const DATA_VERSION = '4';

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    if (localStorage.getItem('vms_data_version') !== DATA_VERSION) {
      localStorage.removeItem('vms_menu_items');
      localStorage.removeItem('vms_restaurant_config');
      localStorage.setItem('vms_data_version', DATA_VERSION);
    }
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

  const [viewMode, setViewMode] = useState<ViewMode>('admin');

  useEffect(() => {
    localStorage.setItem('vms_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('vms_restaurant_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('vms_offline', String(isOffline));
  }, [isOffline]);

  const handleAddMenuItem = (newItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: MenuItem = {
      ...newItem,
      id: `m-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setMenuItems(prev => [item, ...prev]);
    setConfig(prev => ({ ...prev, lastUpdated: Date.now() }));
  };

  const handleUpdateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
    ));
    setConfig(prev => ({ ...prev, lastUpdated: Date.now() }));
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    setConfig(prev => ({ ...prev, lastUpdated: Date.now() }));
  };

  const handleUpdateConfig = (updates: Partial<RestaurantConfig>) => {
    setConfig(prev => ({ ...prev, ...updates, lastUpdated: Date.now() }));
  };

  const handleResetData = () => {
    if (window.confirm('Reset all menu items and branding back to default? All custom edits will be deleted.')) {
      setMenuItems(DEFAULT_MENU_ITEMS);
      setConfig(DEFAULT_CONFIG);
      setIsOffline(false);
      localStorage.removeItem('vms_menu_items');
      localStorage.removeItem('vms_restaurant_config');
      localStorage.removeItem('vms_offline');
    }
  };

  // Kiosk mode: full-screen, no admin chrome
  if (viewMode === 'kiosk') {
    return (
      <div className="h-screen w-screen overflow-hidden bg-[#1A1A1A]">
        <CustomerApp
          menuItems={menuItems}
          config={config}
          isOffline={isOffline}
          onReturnToAdmin={() => setViewMode('admin')}
        />
      </div>
    );
  }

  // Admin mode
  return (
    <div className="min-h-screen bg-[#1C1B19] text-slate-100 font-sans flex flex-col">
      <header className="hidden md:flex bg-[#121212]/90 backdrop-blur-md border-b border-white/5 px-6 py-3.5 items-center justify-between gap-4 select-none z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl text-white font-serif font-black flex items-center justify-center text-sm shadow-lg"
            style={{ background: `linear-gradient(135deg, ${config.primaryColour}, ${config.primaryColour}CC)` }}
          >
            {config.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-display font-medium tracking-widest uppercase" style={{ color: config.uiAccentColour ?? '#2D5E3A' }}>
                {config.name}
              </h1>
              <span
                className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded flex items-center gap-0.5"
                style={{
                  background: `${config.uiAccentColour ?? '#2D5E3A'}1A`,
                  border: `1px solid ${config.uiAccentColour ?? '#2D5E3A'}33`,
                  color: config.uiAccentColour ?? '#2D5E3A'
                }}
              >
                <Crown className="w-2.5 h-2.5" />
                Visual Menu System
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 font-sans font-light block mt-0.5">
              Admin Console
            </span>
          </div>
        </div>

        <button
          onClick={handleResetData}
          title="Reset menu to default"
          className="p-2 bg-zinc-900 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/40 text-neutral-400 rounded-lg border border-white/5 transition-all text-xs flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[10px] uppercase font-bold tracking-wider">Reset Menu</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 bg-slate-50 min-h-0 text-slate-800 overflow-y-auto">
          <AdminPanel
            menuItems={menuItems}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            config={config}
            onUpdateConfig={handleUpdateConfig}
            isOffline={isOffline}
            onToggleOffline={() => setIsOffline(!isOffline)}
            onLaunchKiosk={() => setViewMode('kiosk')}
          />
        </div>
      </div>
    </div>
  );
}
