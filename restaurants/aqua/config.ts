import type { RestaurantConfig } from '../../src/types';

export const config: RestaurantConfig = {
  name: 'Aqua Food & Mood',
  logo: '/aqua/logo.png',
  primaryColour: '#8B0000',
  accentColour: '#1A0C08',
  uiAccentColour: '#C9A96E',
  backgroundImage: '/aqua/hero.jpg',
  welcomeMessage: 'Authentic Lebanese cuisine, fresh ingredients and warm hospitality.',
  pin: '1234',
  lastUpdated: Date.now(),
};

export const categoryFallbacks: Record<string, string> = {
  'Veg Mezze': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  'Mezze': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
  'Big Plates': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80',
  'Mezza Platters': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  'World of Wings': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80',
  'World of Burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  'Vegan Burgers': 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&q=80',
  'Sides': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80',
};
