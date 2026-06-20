import type { RestaurantConfig } from '../../src/types';

export const config: RestaurantConfig = {
  name: 'Olive Tree',
  logo: '/olive-tree/logo.svg',
  primaryColour: '#b29366',
  accentColour: '#46553d',
  uiAccentColour: '#c4a26a',
  backgroundImage: '/olive-tree/olive9.webp',
  welcomeMessage: 'Experience authentic Turkish Mediterranean cuisine. Award-winning flavours, warm hospitality.',
  pin: '1234',
  lastUpdated: Date.now(),
};

export const categoryFallbacks: Record<string, string> = {
  'Chilled Mezzes': '/olive-tree/olive16.webp',
  'Hot Mezzes': '/olive-tree/olive4.webp',
  "Chef's Salads": '/olive-tree/olive5.webp',
  'Traditional Dishes': '/olive-tree/olive1.webp',
  'Olive Tree Wraps': '/olive-tree/olive13.webp',
  'From the Sea': '/olive-tree/olive11.webp',
  'From the Charcoal Grill': '/olive-tree/olive3.webp',
  'Pastas': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
  'Vegetarian & Vegan': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  'Desserts': '/olive-tree/olive2.webp',
  'Cocktails': 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80',
  'Mocktails': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80',
  'Beers': 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=800&q=80',
  'Soft Drinks': 'https://images.unsplash.com/photo-1624552184280-9e73ab704bf7?w=800&q=80',
  "Kids' Menu": 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=80',
  'Sides': 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&q=80',
};
