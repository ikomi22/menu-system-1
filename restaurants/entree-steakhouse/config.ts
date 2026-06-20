import type { RestaurantConfig } from '../../src/types';

export const config: RestaurantConfig = {
  name: 'Entrée Steakhouse',
  logo: '/entree-steakhouse/logo.webp',
  primaryColour: '#C9A96E',
  accentColour: '#1A1A1A',
  uiAccentColour: '#C9A96E',
  backgroundImage: '/entree-steakhouse/hero.jpg',
  welcomeMessage: 'Premium steaks, bold flavours, unforgettable moments.',
  pin: '1234',
  lastUpdated: Date.now(),
};

export const categoryFallbacks: Record<string, string> = {
  starters: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
  'chicken-steak': 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=800&q=80',
  steaks: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
  'gold-collection': 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=800&q=80',
  'entree-cuts': 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&q=80',
  burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  'entree-specials': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  'kids-menu': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
  extras: 'https://images.unsplash.com/photo-1494961104209-3c223057bd26?w=800&q=80',
  sides: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&q=80',
  sauces: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=800&q=80',
  mocktails: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
  mojitos: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80',
  milkshakes: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80',
  'soft-drinks': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
  'hot-drinks': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  desserts: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
};
