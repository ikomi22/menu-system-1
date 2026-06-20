import type { RestaurantConfig } from '../../src/types';

export const config: RestaurantConfig = {
  name: 'arco Bar & Ristorante',
  logo: '/arco/logo.avif',
  primaryColour: '#A83A35',
  accentColour: '#1C1B19',
  uiAccentColour: '#2D5E3A',
  backgroundImage: '/arco/arco1.jpg',
  welcomeMessage: 'Authentic Italian flavours, crafted with passion.',
  pin: '1234',
  lastUpdated: Date.now(),
};

export const categoryFallbacks: Record<string, string> = {
  starters: '/arco/unnamed-6.jpg',
  mains:    '/arco/unnamed-3.jpg',
  pasta:    '/arco/unnamed-2.jpg',
  pizza:    '/arco/unnamed-5.jpg',
  desserts: '/arco/unnamed-13.jpg',
  drinks:   '/arco/unnamed-15.jpg',
};
