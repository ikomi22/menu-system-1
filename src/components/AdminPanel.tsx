/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Settings as SettingsIcon, 
  LogOut, 
  LayoutDashboard, 
  Tablet, 
  Key, 
  Check, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  Upload, 
  X, 
  ChevronRight,
  Sparkles,
  Utensils,
  GlassWater,
  Cake,
  Eye,
  Menu,
  FileText
} from 'lucide-react';
import { MenuItem, RestaurantConfig, Category, OFFICIAL_ALLERGENS } from '../types';
import CustomerApp from './CustomerApp';

// Presets Chef Gallery of food URLs so users can easily select gorgeous pictures
const CHEF_PRESET_IMAGES = [
  { name: 'Tomahawk Ribeye', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80' },
  { name: 'Fresh Salmon', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80' },
  { name: 'Lobster Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80' },
  { name: 'Classic Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80' },
  { name: 'Negroni Sbagliato', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80' },
  { name: 'Warm Lava Souffle', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80' }
];

interface AdminPanelProps {
  menuItems: MenuItem[];
  onAddMenuItem: (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  onDeleteMenuItem: (id: string) => void;
  config: RestaurantConfig;
  onUpdateConfig: (updates: Partial<RestaurantConfig>) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
}

type AdminTab = 'dashboard' | 'add-item' | 'edit-item' | 'preview' | 'settings';

export default function AdminPanel({
  menuItems,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  config,
  onUpdateConfig,
  isOffline,
  onToggleOffline
}: AdminPanelProps) {
  // Auth flow state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('admin@letoile.com');
  const [password, setPassword] = useState('admin123');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  // Category filter state in list
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing items state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('food');
  const [formPriceStr, setFormPriceStr] = useState(''); // E.g. "12.50"
  const [formDescription, setFormDescription] = useState('');
  const [formAllergens, setFormAllergens] = useState<string[]>([]);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Brand config fields state
  const [configName, setConfigName] = useState(config.name);
  const [configLogo, setConfigLogo] = useState(config.logo);
  const [configWelcome, setConfigWelcome] = useState(config.welcomeMessage);
  const [configPrimary, setConfigPrimary] = useState(config.primaryColour);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Handle manual login
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@letoile.com' && password === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect email or password. Use: admin@letoile.com / admin123');
    }
  };

  // Switch to adding screen
  const initAddForm = () => {
    setFormName('');
    setFormCategory('food');
    setFormPriceStr('');
    setFormDescription('');
    setFormAllergens([]);
    setFormImageUrl(CHEF_PRESET_IMAGES[2].url); // select standard lobster pasta as default
    setFormAvailable(true);
    setFormErrors({});
    setEditingItemId(null);
    setActiveTab('add-item');
  };

  // Switch to editing form pre-filled
  const initEditForm = (item: MenuItem) => {
    setFormName(item.name);
    setFormCategory(item.category);
    setFormPriceStr((item.price / 100).toFixed(2));
    setFormDescription(item.description);
    setFormAllergens(item.allergens);
    setFormImageUrl(item.imageUrl);
    setFormAvailable(item.available);
    setFormErrors({});
    setEditingItemId(item.id);
    setActiveTab('edit-item');
  };

  // Validate form details
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = 'Item Name is required';
    if (!formImageUrl.trim()) errors.imageUrl = 'Culinary Photo URL is required';
    
    const parsedPrice = parseFloat(formPriceStr);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      errors.price = 'Price must be a valid positive decimal (e.g. 14.50)';
    }

    if (formDescription.length > 200) {
      errors.description = 'Description cannot surpass 200 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submits (saves or updates)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const parsedPriceInPence = Math.round(parseFloat(formPriceStr) * 100);

    if (editingItemId) {
      // Update existing item
      onUpdateMenuItem(editingItemId, {
        name: formName,
        category: formCategory,
        price: parsedPriceInPence,
        description: formDescription,
        allergens: formAllergens,
        imageUrl: formImageUrl,
        available: formAvailable,
      });
      setEditingItemId(null);
    } else {
      // Add new item
      onAddMenuItem({
        name: formName,
        category: formCategory,
        price: parsedPriceInPence,
        description: formDescription,
        allergens: formAllergens,
        imageUrl: formImageUrl,
        available: formAvailable,
      });
    }

    // Return back to list
    setActiveTab('dashboard');
  };

  // Allergens selector multi checkboxes helper
  const handleToggleAllergen = (allergen: string) => {
    setFormAllergens(prev => 
      prev.includes(allergen) 
        ? prev.filter(a => a !== allergen) 
        : [...prev, allergen]
    );
  };

  // Save Settings Panel changes
  const handleSaveBrandSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      name: configName,
      logo: configLogo,
      welcomeMessage: configWelcome,
      primaryColour: configPrimary,
    });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  // Filter items in list
  const filteredList = menuItems.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Simple stats helper
  const countStats = {
    total: menuItems.length,
    food: menuItems.filter(i => i.category === 'food').length,
    drinks: menuItems.filter(i => i.category === 'drinks').length,
    desserts: menuItems.filter(i => i.category === 'desserts').length,
    unavailable: menuItems.filter(i => !i.available).length
  };

  if (!isAuthenticated) {
    return (
      <div id="admin-login-layout" className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-[#C9A84C] font-serif font-black text-xl shadow-md border border-[#C9A84C]/20">
              LÉ
            </div>
            <h1 className="text-xl font-display font-black text-slate-800 tracking-wider uppercase">
              Visual Menu Service
            </h1>
          </div>
          <h2 className="mt-6 text-center text-3xl font-serif text-slate-900 tracking-tight">
            Administrative Portal
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Secure sign in for restaurant owners and managers
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-100 sm:px-10">
            <form className="space-y-6" onSubmit={handleSignIn}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent outline-none text-slate-800 font-sans text-sm focus:bg-white transition-all bg-slate-50"
                    placeholder="manager@letoile.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent outline-none text-slate-800 font-sans text-sm focus:bg-white transition-all bg-slate-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {authError && (
                <div id="login-error-toast" className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-[#C9A84C] focus:ring-[#C9A84C] border-slate-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-slate-500 select-none">
                    Persist administrator token
                  </label>
                </div>

                <div className="text-xs">
                  <button
                    type="button"
                    onClick={() => alert(`Reset email template simulated! Creds preset: admin@letoile.com / admin123`)}
                    className="font-medium text-[#C9A84C] hover:text-amber-600 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <div>
                <button
                  id="login-submit-btn"
                  type="submit"
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold tracking-wide text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9A84C] transition-all cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block text-center mb-2">
                Demo Quick Fill
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@letoile.com');
                  setPassword('admin123');
                }}
                className="w-full py-2 bg-slate-50 border border-slate-100 hover:border-[#C9A84C]/30 text-xs font-medium text-slate-600 rounded-xl flex items-center justify-center gap-1 cursor-pointer hover:bg-white transiton-all"
              >
                <Key className="w-3 h-3 text-[#C9A84C]" />
                Auto-fill Admin Credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-layout" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none">
      
      {/* Top Admin Header Bar */}
      <header className="bg-white border-b border-slate-100 shrink-0 select-none px-6 py-4 flex items-center justify-between shadow-xs relative z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-[#C9A84C] font-serif font-black text-lg flex items-center justify-center border border-[#C9A84C]/10 shadow">
            LÉ
          </div>
          <div>
            <h2 className="font-display font-black text-sm tracking-wider uppercase text-slate-900 leading-none">
              L'ÉTOILE ADMIN
            </h2>
            <span className="text-[10px] text-zinc-500 tracking-wide inline-block mt-0.5">
              Visual Menu System • Core Console
            </span>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-4">
          
          {/* OFFLINE TOGGLE SIMULATOR BUTTON (Saves Deals for Kiosk Demo of PRD Section 6!) */}
          <button
            id="admin-sim-offline-toggle"
            onClick={onToggleOffline}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border tracking-wide font-medium cursor-pointer transition-all ${
              isOffline 
                ? 'bg-amber-500/10 border-amber-300 text-amber-700 hover:bg-amber-500/15' 
                : 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-200 text-emerald-800'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-600 animate-pulse' : 'bg-emerald-500'}`} />
            <span>Kiosk App: {isOffline ? 'SIMULATE OFFLINE' : 'SIMULATE ONLINE'}</span>
          </button>

          {/* User detail info */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 font-sans text-xs text-slate-700">
            <span className="font-semibold text-slate-800">Admin Owner</span>
            <span className="text-[#a0a0a0]">•</span>
            <span className="text-zinc-500 italic">L'Étoile Luxury Group</span>
          </div>

          <button
            id="admin-signout-btn"
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-white hover:bg-rose-600 px-3 py-1.5 rounded-lg border border-rose-100 hover:border-transparent transition-all cursor-pointer font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Sidebar & Content Layout Container */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar Panel Navigation */}
        <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col justify-between py-6 shrink-0 h-full select-none relative z-20">
          <div className="px-4 space-y-6">
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-black tracking-widest text-[#a0a0a0] uppercase block mb-3">
                Main Console
              </span>
              
              <button
                id="sidebar-tab-dashboard"
                onClick={() => { setActiveTab('dashboard'); setEditingItemId(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === 'dashboard' || activeTab === 'add-item' || activeTab === 'edit-item'
                    ? 'bg-[#C9A84C]/10 text-slate-900 border-l-4 border-[#C9A84C]' 
                    : 'text-[#a0a0a0] hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-[#C9A84C]" />
                <span>Menu Database</span>
              </button>

              <button
                id="sidebar-tab-preview"
                onClick={() => { setActiveTab('preview'); setEditingItemId(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-[#C9A84C]/10 text-slate-900 border-l-4 border-[#C9A84C]' 
                    : 'text-[#a0a0a0] hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Tablet className="w-4 h-4 shrink-0 text-[#C9A84C]" />
                <span>Kiosk Live Preview</span>
              </button>

              <button
                id="sidebar-tab-settings"
                onClick={() => { setActiveTab('settings'); setEditingItemId(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#C9A84C]/10 text-slate-900 border-l-4 border-[#C9A84C]' 
                    : 'text-[#a0a0a0] hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <SettingsIcon className="w-4 h-4 shrink-0 text-[#C9A84C]" />
                <span>Brand Settings</span>
              </button>
            </div>

            {/* Simulated Live Analytics Widget */}
            <div className="bg-slate-50/75 border border-slate-100 rounded-xl p-4 space-y-3 font-sans select-none">
              <span className="text-[9px] font-black tracking-widest text-[#a0a0a0] uppercase block">
                Kiosk Engagement stats
              </span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                  <span className="block text-lg font-bold font-display text-slate-800">140+</span>
                  <span className="text-[9px] text-zinc-500 font-medium">Daily Browsing</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                  <span className="block text-lg font-bold font-display text-[#C9A84C]">+18%</span>
                  <span className="text-[9px] text-emerald-600 font-semibold">Upsell outcome</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4">
            <div className="p-3 bg-zinc-900 text-white rounded-xl text-center select-none border border-white/5 space-y-2">
              <span className="text-[10px] font-semibold text-gold-400 block tracking-wider">Kiosk State Hub</span>
              <p className="text-[8px] text-[#a0a0a0] leading-normal font-light">
                Real-time tablet fleet synchronization is live and fully active.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Dynamic Center Panel */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
          
          {/* TAB 1: DASHBOARD TABLE */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick statistics row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-lg">
                    {countStats.total}
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider block">Total Items</span>
                    <span className="text-xs text-slate-400">Main Menu Database</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider block">Food Recipes</span>
                    <span className="text-xs text-slate-400">{countStats.food} Active Plates</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 text-indigo-400 flex items-center justify-center">
                    <GlassWater className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider block">Beverages</span>
                    <span className="text-xs text-slate-400">{countStats.drinks} Infusions</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 text-pink-400 flex items-center justify-center">
                    <Cake className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider block">Desserts</span>
                    <span className="text-xs text-slate-400">{countStats.desserts} Sweets</span>
                  </div>
                </div>
              </div>

              {/* Controls bar (Tabs and Search) */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Tabs filter */}
                <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg w-full md:w-auto self-start md:self-auto">
                  {(['all', 'food', 'drinks', 'desserts'] as const).map(tab => (
                    <button
                      key={tab}
                      id={`tab-filter-${tab}`}
                      onClick={() => setCategoryFilter(tab)}
                      className={`text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-md cursor-pointer transition-all ${
                        categoryFilter === tab
                          ? 'bg-white text-slate-900 shadow-xs border-b border-white/10'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Right controls: search input and Create button */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      id="menu-search-input"
                      type="text"
                      placeholder="Search recipes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs font-sans rounded-lg pl-9 py-2.5 pr-4 border border-slate-200 focus:ring-1 focus:ring-[#C9A84C] focus:bg-white bg-slate-50 outline-none text-slate-800 transition-all font-light"
                    />
                  </div>

                  <button
                    id="add-new-item-btn"
                    onClick={initAddForm}
                    className="bg-[#C9A84C] hover:bg-[#d6b75f] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-gold-500/10 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Recipe Item
                  </button>
                    
                  <button
                    id="preview-menu-header-btn"
                    onClick={() => setActiveTab('preview')}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider px-3 py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Tablet className="w-4 h-4 text-[#C9A84C]" />
                    Tablet View
                  </button>
                </div>
              </div>

              {/* Recipes database list layout table container */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden select-none">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-serif font-semibold text-slate-800 text-base">Menu Items Database</h3>
                  <span className="text-[10px] text-zinc-500 italic">Showing {filteredList.length} of {menuItems.length} records</span>
                </div>

                {filteredList.length === 0 ? (
                  <div className="p-16 text-center text-slate-500">
                    <Utensils className="w-8 h-8 mx-auto text-slate-300 mb-2 animate-pulse" />
                    <p className="font-serif italic text-sm">No items match your specifications</p>
                    <p className="text-xs text-slate-400 mt-1">Clear filters or typing metrics and try again.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-slate-100 text-left">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                          <th className="px-6 py-3">Photo Ref</th>
                          <th className="px-6 py-3">Dish Spec</th>
                          <th className="px-6 py-3">Category</th>
                          <th className="px-6 py-3">Price</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                        {filteredList.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                            {/* Card Item Preview Image */}
                            <td className="px-6 py-4 shrink-0">
                              <div className="w-14 aspect-16/9 rounded bg-slate-100 overflow-hidden relative border border-slate-200">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            </td>

                            {/* Title / Desc */}
                            <td className="px-6 py-4 max-w-sm">
                              <div>
                                <span className="font-semibold text-slate-900 block text-xs">{item.name}</span>
                                <span className="text-[10px] text-slate-500 line-clamp-1 block mt-0.5">{item.description}</span>
                                {item.allergens.length > 0 && (
                                  <div className="flex gap-1 mt-1 flex-wrap">
                                    {item.allergens.slice(0, 3).map(a => (
                                      <span key={a} className="bg-amber-500/10 text-[9px] text-amber-700 px-1 rounded font-semibold font-sans">{a}</span>
                                    ))}
                                    {item.allergens.length > 3 && (
                                      <span className="text-[9px] text-[#a0a0a0] font-semibold">+{item.allergens.length - 3}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Category badge */}
                            <td className="px-6 py-4 font-sans text-[10px] font-bold uppercase tracking-wider">
                              <span className={`px-2 py-0.5 rounded ${
                                item.category === 'food' 
                                  ? 'bg-amber-500/10 text-amber-700' 
                                  : item.category === 'drinks' 
                                    ? 'bg-indigo-500/10 text-indigo-700' 
                                    : 'bg-pink-500/10 text-pink-700'
                              }`}>
                                {item.category}
                              </span>
                            </td>

                            {/* Price formatted */}
                            <td className="px-[#C9A84C] font-display font-semibold text-slate-900 tracking-wide">
                              £{(item.price / 100).toFixed(2)}
                            </td>

                            {/* Status Availability Toggle */}
                            <td className="px-6 py-4 shrink-0">
                              <button
                                id={`toggle-avail-${item.id}`}
                                onClick={() => onUpdateMenuItem(item.id, { available: !item.available })}
                                className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                                  item.available 
                                    ? 'bg-emerald-500/10 border-emerald-100 text-emerald-700 hover:bg-emerald-500/15' 
                                    : 'bg-rose-500/10 border-rose-100 text-rose-700 hover:bg-rose-500/15'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <span>{item.available ? 'Available' : 'Unavailable'}</span>
                              </button>
                            </td>

                            {/* Edit / Delete actions */}
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  id={`edit-item-btn-${item.id}`}
                                  onClick={() => initEditForm(item)}
                                  className="p-1.5 border border-slate-200 text-slate-600 hover:text-slate-950 rounded hover:bg-slate-50 cursor-pointer transition-all"
                                  title="Edit Item details"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                
                                <button
                                  id={`delete-item-btn-${item.id}`}
                                  onClick={() => setShowDeleteConfirm(item.id)}
                                  className="p-1.5 border border-rose-100 text-rose-600 hover:text-white hover:bg-rose-600 rounded cursor-pointer transition-all"
                                  title="Delete item from database"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2 & 3: FORM VIEW (Add or Edit) */}
          {(activeTab === 'add-item' || activeTab === 'edit-item') && (
            <div className="max-w-3xl mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden select-none">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h3 className="font-serif font-semibold text-[#1A1A1A] text-lg">
                    {editingItemId ? `Edit Recipe Details: ${formName}` : 'Add New Recipe to Menu'}
                  </h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Fill in the fields below to synchronize to Kiosk units.</p>
                </div>
                <button
                  onClick={() => { setActiveTab('dashboard'); setEditingItemId(null); }}
                  className="p-1.5 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form container */}
              <form onSubmit={handleSaveItem} className="p-6 md:p-8 space-y-6">
                
                {/* Visual Section Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Dish Name *
                    </label>
                    <input
                      id="form-item-name"
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className={`block w-full px-4 py-3 border rounded-xl outline-none text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C9A84C] transition-all ${
                        formErrors.name ? 'border-red-400 focus:ring-red-500' : 'border-slate-200'
                      }`}
                      placeholder="E.g. Roasted Rack of Lamb"
                    />
                    {formErrors.name && (
                      <span className="text-[10px] text-red-500 block mt-1 font-medium">{formErrors.name}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Category Selection *
                    </label>
                    <select
                      id="form-item-category"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as Category)}
                      className="block w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C9A84C] transition-all font-sans cursor-pointer"
                    >
                      <option value="food">Food Menu (Starters/Mains/Sides)</option>
                      <option value="drinks">Drinks Menu (Beverages)</option>
                      <option value="desserts">Dessert Menu (Puddings)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Price * (GBP £)
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-slate-500 text-xs font-semibold">£</span>
                      </div>
                      <input
                        id="form-item-price"
                        type="text"
                        required
                        value={formPriceStr}
                        onChange={(e) => setFormPriceStr(e.target.value)}
                        className={`block w-full pl-8 pr-4 py-3 border rounded-xl outline-none text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C9A84C] transition-all font-semibold ${
                          formErrors.price ? 'border-red-400 focus:ring-red-500' : 'border-slate-200'
                        }`}
                        placeholder="14.50"
                      />
                    </div>
                    {formErrors.price ? (
                      <span className="text-[10px] text-red-500 block mt-1 font-medium">{formErrors.price}</span>
                    ) : (
                      <span className="text-[9px] text-zinc-500 inline-block mt-1 font-light">E.g. Type "12.50" for twelve pounds fifty. We convert to pence natively.</span>
                    )}
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Service Active Status
                    </label>
                    <div className="mt-2.5 flex items-center">
                      <button
                        type="button"
                        onClick={() => setFormAvailable(!formAvailable)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          formAvailable 
                            ? 'bg-emerald-500/10 border-emerald-200 text-emerald-800' 
                            : 'bg-rose-500/10 border-rose-200 text-rose-800'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${formAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span>{formAvailable ? 'Available on next Sync' : 'Hides instantly from Tables'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Recipe Description (Max 200 characters)
                    </label>
                    <span className={`text-[10px] font-mono ${formDescription.length > 200 ? 'text-red-500 font-bold' : 'text-[#a0a0a0]'}`}>
                      {formDescription.length} / 200
                    </span>
                  </div>
                  <textarea
                    id="form-item-desc"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                    className={`block w-full px-4 py-3 border rounded-xl outline-none text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C9A84C] transition-all leading-normal ${
                      formErrors.description ? 'border-red-400 focus:ring-red-500' : 'border-slate-200'
                    }`}
                    placeholder="Provide a luxurious sensory description of preparation methods, seasoning, or cuts. Highly visual words trigger appetism. E.g. 'Dry-aged Prime cuts layered in wild herbs...'"
                  />
                  {formErrors.description && (
                    <span className="text-[10px] text-red-500 block mt-1 font-medium">{formErrors.description}</span>
                  )}
                </div>

                {/* Photo File upload selection area of section 4.3 */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    High Resolution Food Photograph (URL Upload) *
                  </label>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        id="form-item-image-url"
                        type="url"
                        required
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        className={`block w-full px-4 py-3 border rounded-xl outline-none text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C9A84C] transition-all ${
                          formErrors.imageUrl ? 'border-red-400 focus:ring-red-500' : 'border-slate-200'
                        }`}
                        placeholder="Paste Unsplash or static image URL here..."
                      />
                      {formErrors.imageUrl && (
                        <span className="text-[10px] text-red-500 block mt-1 font-medium">{formErrors.imageUrl}</span>
                      )}
                    </div>

                    {/* Quick Mock Crop helper box */}
                    <div className="h-11 px-4 border border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-1.5 text-xs text-slate-500 bg-slate-50 text-center font-medium font-sans">
                      <Upload className="w-4 h-4 text-[#C9A84C]" />
                      <span className="hidden sm:inline">16:9 Interactive Autocrop Enabled</span>
                    </div>
                  </div>

                  {/* Curated quick-select Chef imagery library so demo user has a fast easy beautiful flow */}
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                    <span className="text-[9px] font-black tracking-widest text-[#a0a0a0] uppercase block mb-2">
                      Or Quick Select From Michelin-Quality Presets:
                    </span>
                    <div className="grid grid-cols-6 gap-2">
                      {CHEF_PRESET_IMAGES.map(preset => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setFormImageUrl(preset.url)}
                          className={`group aspect-16/9 rounded-lg overflow-hidden border-2 transition-all relative block shrink-0 ${
                            formImageUrl === preset.url ? 'border-[#C9A84C] scale-95 shadow-md' : 'border-transparent opacity-65 hover:opacity-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[7px] text-white font-bold uppercase tracking-wider text-center px-1 leading-normal">{preset.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Loaded Image Thumbnail Preview Box */}
                  {formImageUrl && (
                    <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-4">
                      <div className="w-20 aspect-16/9 rounded overflow-hidden relative border border-slate-300 bg-slate-200 shrink-0">
                        <img 
                          src={formImageUrl} 
                          alt="Thumbnail Preview" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-800 block">Cropped Photograph Preview</span>
                        <p className="text-[9px] text-zinc-500 font-light max-w-sm line-clamp-1 truncate">{formImageUrl}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 14 Official UK Allergens Select block */}
                <div className="space-y-3">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Official UK Allergens Checklist (Select all that apply)
                  </span>
                  <p className="text-[9px] text-zinc-500 font-light leading-normal -mt-1">
                    Checkboxes ticked here register warning tags. If unchecked, the item is labeled allergen-clean in detail screens.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {OFFICIAL_ALLERGENS.map(allergen => {
                      const isChecked = formAllergens.includes(allergen);
                      return (
                        <button
                          key={allergen}
                          type="button"
                          onClick={() => handleToggleAllergen(allergen)}
                          className={`py-2 px-2.5 rounded-xl border-2 text-[11px] font-bold text-center block transition-all cursor-pointer ${
                            isChecked 
                              ? 'bg-amber-500/10 border-[#C9A84C] text-[#C9A84C] shadow-xs' 
                              : 'bg-white border-slate-100 text-slate-500 hover:border-[#C9A84C]/35'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {isChecked && <Check className="w-3 h-3 text-[#C9A84C] shrink-0" />}
                            <span className="truncate">{allergen}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action buttons footer */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('dashboard'); setEditingItemId(null); }}
                    className="px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold tracking-wide text-slate-600 cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 font-display font-semibold uppercase tracking-wider text-white rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-zinc-900/10 transition-all"
                  >
                    <Check className="w-4 h-4 text-[#C9A84C]" />
                    {editingItemId ? 'Update Recipe' : 'Save Recipe'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: PREVIEW MODE (Awesome decorative tablet screen of Section 4) */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              
              {/* Gold Top Banner info */}
              <div className="bg-[#C9A84C] p-4 rounded-xl flex items-center justify-between shadow text-[#1A1A1A] gap-4 select-none">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-[#1A1A1A]">
                    <Sparkles className="w-4 h-4 text-[#1A1A1A] fill-[#1A1A1A]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm tracking-wide leading-none">Tablet Preview Session</h3>
                    <span className="text-[10px] uppercase font-bold tracking-widest block mt-0.5 opacity-80">
                      Live content Synchronization Active
                    </span>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold bg-black/10 px-3 py-1.5 rounded-lg select-none">
                  <Eye className="w-4 h-4 text-[#1A1A1A]" />
                  <span>Interactive Simulator Mode</span>
                </div>
              </div>

              {/* Tablet frame container */}
              <div className="flex justify-center items-center py-4 bg-slate-100 border border-slate-200 rounded-3xl p-6 min-h-[640px] relative overflow-hidden select-none shadow-inner">
                
                {/* PORTRAIT INDUSTRIAL TABLET MOCKUP FRAME */}
                <div className="w-full max-w-[420px] aspect-[10/16] bg-slate-950 border-[14px] border-slate-900 rounded-[38px] shadow-[0_30px_70px_rgba(0,0,0,0.55)] relative overflow-hidden flex flex-col pt-4">
                  
                  {/* Speaker mesh pill */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-neutral-800 rounded-full z-40" />
                  
                  {/* Camera hole dot */}
                  <div className="absolute top-1.5 right-6 w-1.5 h-1.5 bg-neutral-800 rounded-full z-40" />

                  {/* Render real live Kiosk app inside tablet frame! */}
                  <div className="flex-1 w-full h-full bg-[#1A1A1A] overflow-hidden rounded-t-[12px] relative">
                    <CustomerApp
                      menuItems={menuItems}
                      config={config}
                      isOffline={isOffline}
                    />
                  </div>

                  {/* Tablet tactile soft home indent indicator */}
                  <div className="bg-slate-900 h-8 flex items-center justify-center pb-1">
                    <div className="w-[35%] h-1 bg-neutral-700 rounded-full z-40" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden select-none">
              
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h3 className="font-serif font-semibold text-slate-800 text-base">Branding Settings</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">Customize customer faces, colors and Welcome logos.</p>
                </div>
              </div>

              <form onSubmit={handleSaveBrandSettings} className="p-6 md:p-8 space-y-5">
                
                {/* Display Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Restaurant Display Name
                  </label>
                  <input
                    id="settings-rest-name"
                    type="text"
                    required
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C9A84C] transition-all font-serif font-semibold"
                    placeholder="L'Étoile Dorée"
                  />
                </div>

                {/* Logo Image */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Logo Image (URL or Base64)
                  </label>
                  <input
                    id="settings-rest-logo"
                    type="url"
                    required
                    value={configLogo}
                    onChange={(e) => setConfigLogo(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-xs text-zinc-600 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C9A84C] transition-all"
                  />
                  <div className="flex gap-4 items-center mt-3 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="w-12 h-12 rounded-full border border-slate-200 bg-white overflow-hidden p-1 flex items-center justify-center shadow-xs shrink-0">
                      <img src={configLogo} alt="Logo preview" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium font-sans">
                      This logo coordinates inside the Welcome and explore states on customer Kiosks. Transparent PNG recommended.
                    </span>
                  </div>
                </div>

                {/* Welcome tagline */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Kiosk Slogan (Max 60 characters)
                    </label>
                    <span className="text-[10px] font-mono text-[#a0a0a0]">{configWelcome.length} / 60</span>
                  </div>
                  <input
                    id="settings-rest-welcome"
                    type="text"
                    maxLength={60}
                    value={configWelcome}
                    onChange={(e) => setConfigWelcome(e.target.value)}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl outline-none text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#C9A84C] transition-all italic font-light font-serif"
                    placeholder="E.g. Indulge in culinary excellence."
                  />
                </div>

                {/* Accent Color picker */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Kiosk Theme Primary Accent Colour
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      id="settings-rest-color"
                      type="color"
                      value={configPrimary}
                      onChange={(e) => setConfigPrimary(e.target.value)}
                      className="block w-12 h-12 border-2 border-slate-200 rounded-lg outline-none cursor-pointer bg-transparent"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block tracking-wider font-mono">{configPrimary}</span>
                      <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Selected brand accent. Gold (#C9A84C) is the premium default.</span>
                    </div>
                  </div>
                </div>

                {/* Feedback Toast message */}
                {settingsSuccess && (
                  <div id="settings-success-toast" className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-1 border border-emerald-100">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Brand Settings updated. Syncing details to active Kiosk units!</span>
                  </div>
                )}

                {/* Reset button trigger */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      alert('Simulating password change link dispatch to active partner email account!');
                    }}
                    className="text-xs font-medium text-[#C9A84C] hover:text-amber-600 underline cursor-pointer"
                  >
                    Change Admin Password
                  </button>

                  <button
                    id="settings-save-btn"
                    type="submit"
                    className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 font-display font-semibold uppercase tracking-wider text-white rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Delete Confirmation Modal Layer */}
      {showDeleteConfirm && (
        <div id="delete-confirm-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 max-w-sm w-full p-6 space-y-4 shadow-2xl relative select-none animate-bounce-short">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center font-sans">
              <h4 className="font-semibold text-slate-900 text-sm">Remove this Recipe?</h4>
              <p className="text-xs text-[#a0a0a0] mt-1.5 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-800 font-serif">"{menuItems.find(i => i.id === showDeleteConfirm)?.name}"</span>? This will instantly erase the item from tablets.
              </p>
            </div>

            <div className="flex gap-2.5 items-center justify-center pt-2">
              <button
                id="cancel-delete-btn"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-slate-100 text-[#a0a0a0] hover:text-slate-800 text-xs font-semibold rounded-lg cursor-pointer transition-all border border-transparent hover:border-slate-200"
              >
                Keep Item
              </button>
              <button
                id="confirm-delete-btn"
                onClick={() => {
                  if (showDeleteConfirm) {
                    onDeleteMenuItem(showDeleteConfirm);
                    setShowDeleteConfirm(null);
                  }
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-all shadow shadow-rose-600/10"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
