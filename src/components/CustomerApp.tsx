/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  HelpCircle,
  Sparkles,
  Flame,
  Check,
  WifiOff,
  ShieldAlert,
  Maximize2,
  X
} from 'lucide-react';
import { MenuItem, RestaurantConfig, Category, OFFICIAL_ALLERGENS } from '../types';
import { CATEGORY_FALLBACK_IMAGES } from '../data';
import FoodAnimation from './FoodAnimation';

interface CustomerAppProps {
  menuItems: MenuItem[];
  config: RestaurantConfig;
  isOffline: boolean;
  onReturnToAdmin: () => void;
}

type CustomerScreen = 'welcome' | 'category' | 'browse' | 'detail';

export default function CustomerApp({
  menuItems,
  config,
  isOffline,
  onReturnToAdmin
}: CustomerAppProps) {
  // Navigation and view states
  const [screen, setScreen] = useState<CustomerScreen>('welcome');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // PIN exit: 5 taps on top-right corner within 3s
  const [pinOverlayOpen, setPinOverlayOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCornerTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => { tapCountRef.current = 0; }, 3000);
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      setPinInput('');
      setPinError(false);
      setPinOverlayOpen(true);
    }
  };

  const handlePinSubmit = () => {
    if (pinInput === (config.pin ?? '1234')) {
      setPinOverlayOpen(false);
      onReturnToAdmin();
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // Inactivity tracking
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // List of active items (available: true)
  const activeItems = menuItems.filter(item => item.available);

  // Derived category list in menu order (preserves first-seen order)
  const categories = useMemo(() => {
    const seen = new Set<string>();
    return activeItems.reduce<string[]>((acc, item) => {
      if (!seen.has(item.category)) { seen.add(item.category); acc.push(item.category); }
      return acc;
    }, []);
  }, [activeItems]);

  // Filtered browse list
  const filteredItems = activeItems.filter(item => selectedCategory ? item.category === selectedCategory : true);

  // Reset inactivity timer on any interaction
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    inactivityTimerRef.current = setTimeout(() => {
      setScreen('welcome');
      setSelectedCategory(null);
      setSelectedItem(null);
      setLightboxOpen(false);
    }, 180000);
  };

  // Monitor user activity
  useEffect(() => {
    resetInactivityTimer();

    const handleInteraction = () => {
      resetInactivityTimer();
    };

    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('scroll', handleInteraction, true);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('scroll', handleInteraction, true);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [screen, menuItems]);

  const selectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setScreen('browse');
  };

  const formatCategoryLabel = (cat: string) =>
    cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const selectItemDetail = (item: MenuItem) => {
    setSelectedItem(item);
    setScreen('detail');
    setLightboxOpen(false);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  const formatPrice = (pence: number) => {
    return `£${(pence / 100).toFixed(2)}`;
  };

  // Helper lists of icons for common allergens
  const getAllergenDetails = (name: string) => {
    const detailMap: Record<string, { icon: string; bg: string }> = {
      Gluten: { icon: '🌾', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Milk: { icon: '🥛', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Eggs: { icon: '🍳', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Nuts: { icon: '🌰', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Peanuts: { icon: '🥜', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Fish: { icon: '🐟', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Crustaceans: { icon: '🦐', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Molluscs: { icon: '🐚', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Soya: { icon: '🫘', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Mustard: { icon: '🍶', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Celery: { icon: '🌿', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Sesame: { icon: '🥯', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Lupin: { icon: '🌸', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      Sulphites: { icon: '🍷', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    };
    return detailMap[name] || { icon: '⚠️', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
  };

  const accent = config.uiAccentColour ?? '#2D5E3A';
  const primary = config.primaryColour;

  return (
    <div id="customer-kiosk-frame" className="relative kiosk-viewport bg-[#1a1a1a] text-white flex flex-col font-sans h-full overflow-hidden select-none">
      
      {/* SCREEN 6 - Offline Banner (Thin non-intrusive strip) */}
      {isOffline && (
        <div id="offline-banner" className="h-7 bg-[#2c2c2c] border-b border-yellow-600/20 flex items-center justify-center gap-2 px-4 shadow-[0_2px_10px_rgba(0,0,0,0.5)] z-50 shrink-0">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sans text-[#a0a0a0] text-[11px] tracking-wide font-medium">
            Menu loaded locally • Last updated {new Date(config.lastUpdated).toLocaleDateString()} at {new Date(config.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}

      {/* Hidden 5-tap exit zone — top-right corner, invisible to customers */}
      <div
        className="absolute top-0 right-0 w-14 h-14 z-50"
        onClick={handleCornerTap}
      />

      {/* PIN overlay — appears after 5-tap gesture */}
      {pinOverlayOpen && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1C1B19] border border-white/10 rounded-2xl p-8 w-72 flex flex-col items-center gap-5 shadow-2xl">
            <p className="text-white text-sm font-semibold tracking-wide">Enter Admin PIN</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              autoFocus
              value={pinInput}
              onChange={e => { setPinInput(e.target.value); setPinError(false); }}
              onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
              className={`w-full text-center text-2xl tracking-[0.5em] bg-black/40 border rounded-xl px-4 py-3 text-white outline-none transition-all ${
                pinError ? 'border-red-500' : 'border-white/20'
              }`}
              style={!pinError ? { outlineColor: accent } : {}}
              placeholder="••••"
            />
            {pinError && <p className="text-red-400 text-xs -mt-2">Incorrect PIN</p>}
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setPinOverlayOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
                style={{ backgroundColor: accent }}
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Kiosk Layout Body */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1 - WELCOME SCREEN */}
          {screen === 'welcome' && (
            <motion.div 
              key="welcome-screen"
              id="kiosk-welcome-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-8 bg-cover bg-center"
              style={{
                backgroundImage: config.backgroundImage
                  ? `linear-gradient(rgba(26, 26, 26, 0.52), rgba(26, 26, 26, 0.68)), url('${config.backgroundImage}')`
                  : 'none'
              }}
            >
              {/* Wordmark */}
              <p className="font-serif text-4xl font-bold tracking-widest uppercase text-center" style={{ color: primary }}>
                {config.name}
              </p>

              {/* Tagline */}
              {config.welcomeMessage && (
                <p className="font-sans italic text-white/55 text-base text-center max-w-sm font-light">
                  "{config.welcomeMessage}"
                </p>
              )}

              {/* CTA */}
              <motion.button
                id="welcome-explore-btn"
                onClick={() => setScreen('category')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-72 h-14 rounded-lg text-white font-display font-semibold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:opacity-90 active:scale-95"
                style={{ backgroundColor: primary, boxShadow: `0 10px 30px ${primary}59` }}
              >
                <Sparkles className="w-4 h-4 fill-white" />
                Explore Our Menu
              </motion.button>
            </motion.div>
          )}

            {/* SCREEN 2 - CATEGORY SCREEN */}
            {screen === 'category' && (
              <motion.div
                key="category-screen"
                id="kiosk-category-screen"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute inset-0 bg-[#1A1A1A] flex flex-col py-8 px-6 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between h-10 border-b border-white/5 pb-4 shrink-0">
                  <button
                    id="category-back"
                    onClick={() => setScreen('welcome')}
                    className="group flex items-center gap-2 text-[#a0a0a0] hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" style={{ color: accent }} />
                    <span className="font-sans text-xs tracking-wider uppercase font-medium">Welcome</span>
                  </button>
                  <span className="font-sans tracking-widest text-[10px] uppercase font-semibold" style={{ color: accent }}>
                    {config.name}
                  </span>
                  <div className="w-20" /> {/* Spacer */}
                </div>

              {/* Categories block — derived from live menu data */}
              <div className="flex-1 overflow-y-auto no-scrollbar mt-4 py-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(cat => {
                  const imageUrl = CATEGORY_FALLBACK_IMAGES[cat] ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80';
                  const preview = activeItems.filter(i => i.category === cat).slice(0, 3).map(i => i.name).join(' · ');
                  return (
                    <motion.button
                      key={cat}
                      id={`category-${cat}-btn`}
                      onClick={() => selectCategory(cat)}
                      whileTap={{ scale: 0.97 }}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-white/5 block text-left cursor-pointer group"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.82)), url('${imageUrl}')` }}
                      />
                      <div className="absolute inset-0 p-4 flex flex-col justify-end">
                        <h3 className="font-serif text-2xl text-white font-bold tracking-wide leading-tight">{formatCategoryLabel(cat)}</h3>
                        {preview && <p className="font-sans text-white/65 text-xs mt-1.5 font-light tracking-wide">{preview}</p>}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN 4 - BROWSE SCREEN */}
          {screen === 'browse' && (
            <motion.div
              key="browse-screen"
              id="kiosk-browse-screen"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 bg-[#1A1A1A] flex flex-col py-6 px-5 overflow-hidden"
            >
              {/* Header with selected category */}
              <div className="flex items-center justify-between h-14 border-b border-white/5 pb-3 shrink-0">
                <button
                  id="browse-back"
                  onClick={() => {
                    setSelectedCategory(null);
                    setScreen('category');
                  }}
                  className="group flex items-center gap-2 text-[#a0a0a0] hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" style={{ color: accent }} />
                  <span className="font-sans text-xs tracking-wider uppercase font-medium">Categories</span>
                </button>
                <span className="font-serif italic font-semibold text-white capitalize text-lg tracking-wide">
                  {selectedCategory ? formatCategoryLabel(selectedCategory) : ''}
                </span>
                <span className="font-sans text-[10px] font-mono border border-gold-500/15 text-gold-500 bg-black/30 rounded px-2 py-0.5 tracking-wider uppercase">
                  {filteredItems.length} Available
                </span>
              </div>

              {/* Browse Grid Container */}
              <div className="flex-1 overflow-y-auto no-scrollbar pt-4 pb-12">
                {filteredItems.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center p-8 text-center bg-[#2C2C2C] border border-white/5 rounded-xl">
                    <HelpCircle className="w-8 h-8 text-[#2D5E3A]/40 mb-3 animate-pulse" />
                    <p className="font-serif italic text-white text-base">Nothing here yet</p>
                    <p className="font-sans text-[#a0a0a0] text-xs mt-1 leading-relaxed">
                      Our kitchen is preparing dishes for this section. Check back in a moment.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-auto">
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        id={`dish-card-${item.id}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.04, 0.4) }}
                        onClick={() => selectItemDetail(item)}
                        whileTap={{ scale: 0.97 }}
                        className="group bg-[#2C2C2C] border border-white/5 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                        style={{ contain: 'layout' }}
                      >
                        {/* 16:9 Image */}
                        <div className="aspect-video w-full overflow-hidden relative select-none">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                          {item.allergens.length > 0 && (
                            <div className="absolute top-2 right-2 bg-black/60 border border-white/5 rounded px-1.5 py-0.5 text-[8px] tracking-widest text-amber-400 font-semibold uppercase">
                              Contains Allergens
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 flex gap-1">
                            {item.isVegetarian && (
                              <span className="text-[8px] font-bold uppercase tracking-wider bg-green-600/80 text-white px-1.5 py-0.5 rounded">V</span>
                            )}
                            {item.isGlutenFree && (
                              <span className="text-[8px] font-bold uppercase tracking-wider bg-blue-600/80 text-white px-1.5 py-0.5 rounded">GF</span>
                            )}
                          </div>
                          <FoodAnimation category={item.category} variant="card" />
                        </div>

                        {/* Dish title and price */}
                        <div className="px-3 pt-2.5 pb-3">
                          <h4 className="font-sans font-bold text-white text-xs sm:text-sm line-clamp-2 leading-snug">
                            {item.name}
                          </h4>
                          <span className="font-display font-medium text-[13px] tracking-wide block mt-1.5" style={{ color: accent }}>
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* SCREEN 5 - DISH DETAIL SCREEN */}
          {screen === 'detail' && selectedItem && (
            <motion.div
              key="detail-screen"
              id="kiosk-detail-screen"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute inset-0 bg-[#1A1A1A] flex flex-col overflow-y-auto no-scrollbar"
            >
              {/* Image Banner Top Cover */}
              <div className="h-[40%] min-h-[220px] w-full relative select-none shrink-0">
                <div
                  className="w-full h-full relative cursor-zoom-in group/img"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/30" />
                  <FoodAnimation category={selectedItem.category} variant="hero" />
                  {/* Expand hint */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Overlaid Elegant Back Button */}
                <button
                  id="detail-back"
                  onClick={() => {
                    setSelectedItem(null);
                    setScreen('browse');
                    setLightboxOpen(false);
                  }}
                  className="absolute top-4 left-4 h-9 w-9 rounded-full bg-black/65 border border-white/10 flex items-center justify-center text-white hover:bg-black transition-all select-none cursor-pointer scale-100 font-sans shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                >
                  <ArrowLeft className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Detail Contents */}
              <div className="flex-1 px-6 pb-20 -mt-2 relative z-10 flex flex-col justify-between gap-6">
                <div>
                  <h2 className="font-serif text-white text-3xl font-semibold tracking-wide leading-tight">
                    {selectedItem.name}
                  </h2>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="font-display font-bold text-xl" style={{ color: accent }}>
                      {formatPrice(selectedItem.price)}
                    </span>
                    {selectedItem.isVegetarian && (
                      <span className="text-[8px] font-bold uppercase tracking-wider bg-green-600/80 text-white px-1.5 py-0.5 rounded">V</span>
                    )}
                    {selectedItem.isGlutenFree && (
                      <span className="text-[8px] font-bold uppercase tracking-wider bg-blue-600/80 text-white px-1.5 py-0.5 rounded">GF</span>
                    )}
                  </div>

                  <hr className="border-white/5 my-5" />

                  {/* Description */}
                  <div className="space-y-3">
                    <h5 className="font-serif italic text-xs tracking-widest text-[#a0a0a0] uppercase font-semibold">
                      Gastronomy Note
                    </h5>
                    <p className="font-sans text-[#a0a0a0]/90 text-sm leading-relaxed antialiased font-light">
                      {selectedItem.description || 'Our master chef has carefully crafted this exquisite recipe focusing on organic ingredients and deep natural flavors. Contact staff for seasonal variations.'}
                    </p>
                  </div>
                </div>

                {/* Pairs Well With */}
                {(() => {
                  const pairedItems = (selectedItem.pairedItemIds ?? [])
                    .map(id => menuItems.find(m => m.id === id && m.available))
                    .filter((m): m is MenuItem => m !== undefined)
                    .slice(0, 2);
                  return pairedItems.length > 0 ? (
                    <div className="space-y-3">
                      <h5 className="font-serif italic text-xs tracking-widest text-[#a0a0a0] uppercase font-semibold">
                        Pairs Well With
                      </h5>
                      <div className="flex gap-3">
                        {pairedItems.map(paired => (
                          <button
                            key={paired.id}
                            onClick={() => selectItemDetail(paired)}
                            className="flex-1 flex items-center gap-3 bg-[#2C2C2C] border border-white/5 rounded-xl p-2.5 cursor-pointer transition-all group text-left"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                              <img
                                src={paired.imageUrl}
                                alt={paired.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="font-sans text-xs text-white font-semibold line-clamp-1 block">
                                {paired.name}
                              </span>
                              <span className="font-display text-xs font-medium block mt-0.5" style={{ color: accent }}>
                                {formatPrice(paired.price)}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* UK Allergens Section */}
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                  <span className="font-serif italic text-xs tracking-widest text-[#a0a0a0] uppercase font-semibold block">
                    Contains Allergens
                  </span>
                  
                  {selectedItem.allergens && selectedItem.allergens.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5">
                      {selectedItem.allergens.map(allergen => {
                        const style = getAllergenDetails(allergen);
                        return (
                          <div 
                            key={allergen}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold select-none ${style.bg}`}
                          >
                            <span className="text-[13px]">{style.icon}</span>
                            <span>{allergen}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-[#2C2C2C]/55 border border-white/5 p-3 rounded-lg flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="font-sans text-xs text-[#a0a0a0]">
                        No allergens flag compiled for this item by staff.
                      </span>
                    </div>
                  )}

                  <p className="font-sans text-[10px] text-[#a0a0a0]/50 leading-relaxed font-light mt-2 italic">
                    * If you have highly severe food sensitivities, please alert your waiter directly. Our kitchens sanitize all preparation surfaces but trace factors may exist.
                  </p>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Full-screen image lightbox — must live outside all motion.divs so position:fixed
          is not trapped by a Framer Motion transform containing block */}
      <AnimatePresence>
        {lightboxOpen && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center cursor-zoom-out"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              src={selectedItem.imageUrl}
              alt={selectedItem.name}
              referrerPolicy="no-referrer"
              className="max-w-[100vw] max-h-[100vh] object-contain select-none"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
              <span className="font-serif text-white/70 text-base tracking-wide">{selectedItem.name}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
