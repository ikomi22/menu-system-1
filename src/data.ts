/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, RestaurantConfig } from './types';

export const DEFAULT_CONFIG: RestaurantConfig = {
  name: 'L\'Étoile Dorée',
  logo: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=150&auto=format&fit=crop&q=80',
  primaryColour: '#C9A84C', // Gold accent
  accentColour: '#1A1A1A',  // Elegant dark background
  welcomeMessage: 'A culinary journey curated through visual indulgence.',
  lastUpdated: Date.now(),
};

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: '28-Day Dry-Aged Ribeye',
    description: 'Sear-grilled thick-cut ribeye steak, roasted garlic confit wild herbs, organic butter baste served on hot slate.',
    price: 3400, // £34.00
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    allergens: ['Milk'],
    available: true,
    createdAt: Date.now() - 1000 * 3600 * 24 * 5,
    updatedAt: Date.now() - 1000 * 3600 * 24 * 5,
  },
  {
    id: 'm2',
    name: 'Pan-Seared Salmon Filet',
    description: 'Crisp skin pan-seared wild salmon, saffron potato emulsion, asparagus spears, dill hollandaise butter.',
    price: 2650, // £26.50
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
    allergens: ['Fish', 'Milk', 'Eggs'],
    available: true,
    createdAt: Date.now() - 1000 * 3600 * 24 * 4,
    updatedAt: Date.now() - 1000 * 3600 * 24 * 4,
  },
  {
    id: 'm3',
    name: 'Truffle Mushroom Gnocchi',
    description: 'House-rolled potato gnocchi, black winter truffle velouté, sautéed forest chanterelles, shavings of aged Parmigiano.',
    price: 2200, // £22.00
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop&q=80',
    allergens: ['Gluten', 'Milk', 'Eggs'],
    available: true,
    createdAt: Date.now() - 1000 * 3600 * 24 * 3,
    updatedAt: Date.now() - 1000 * 3600 * 24 * 3,
  },
  {
    id: 'm4',
    name: 'Oak-Smoked Salmon Bruschetta',
    description: 'Artisanal grilled sourdough, whipped lemon & dill fresh cheese, layers of Scottish cold-smoked salmon, capers, organic microgreens.',
    price: 1250, // £12.50
    category: 'food',
    imageUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=800&auto=format&fit=crop&q=80',
    allergens: ['Gluten', 'Fish', 'Milk'],
    available: true,
    createdAt: Date.now() - 1000 * 3600 * 24 * 2,
    updatedAt: Date.now() - 1000 * 3600 * 24 * 2,
  },
  {
    id: 'm5',
    name: 'Smoked Maple Old Fashioned',
    description: 'Double-cask hand-selected bourbon, organic cold-smoked maple essence, wild bitters, custom hand-cut clear ice sphere, orange peel skin zest.',
    price: 1400, // £14.00
    category: 'drinks',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80',
    allergens: [],
    available: true,
    createdAt: Date.now() - 1000 * 3600 * 24 * 8,
    updatedAt: Date.now() - 1000 * 3600 * 24 * 8,
  },
  {
    id: 'm6',
    name: 'Reserve Espresso Martini',
    description: 'Espresso extracted to order, small-batch vodka, cold coffee nectar infusions, toasted vanilla bean sugar, crisp crema foam crown.',
    price: 1350, // £13.50
    category: 'drinks',
    imageUrl: 'https://images.unsplash.com/photo-1545696911-c43a2453c9e4?w=800&auto=format&fit=crop&q=80',
    allergens: [],
    available: true,
    createdAt: Date.now() - 1000 * 3600 * 24 * 7,
    updatedAt: Date.now() - 1000 * 3600 * 24 * 7,
  },
  {
    id: 'm7',
    name: 'Sicilian Lavender Lemon Soda',
    description: 'Premium sparkling natural mineral spring carbonation, cold-pressed Sicilian lemon flesh, organic lavender blossoms extraction, sweet agave nectar thread.',
    price: 650, // £6.50
    category: 'drinks',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    allergens: [],
    available: true,
    createdAt: Date.now() - 1000 * 3600 * 24 * 6,
    updatedAt: Date.now() - 1000 * 3600 * 24 * 6,
  },
  {
    id: 'm8',
    name: 'Valrhona Molten Fondant',
    description: 'Baked to order 72% cocoa dark chocolate cloud soufflé shell, warm decadent liquid center, scoop of real Tahitian vanilla pod cream gelato.',
    price: 950, // £9.50
    category: 'desserts',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    allergens: ['Gluten', 'Eggs', 'Milk', 'Soya'],
    available: true,
    createdAt: Date.now() - 1000 * 3600 * 24 * 1,
    updatedAt: Date.now() - 1000 * 3600 * 12,
  },
  {
    id: 'm9',
    name: 'Madagascan Crème Brûlée',
    description: 'Double cream custard flavored with crushed vanilla pods, perfectly roasted glass sugar shelf, fresh wild forest raspberry adornments.',
    price: 900, // £9.00
    category: 'desserts',
    imageUrl: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?w=800&auto=format&fit=crop&q=80',
    allergens: ['Eggs', 'Milk'],
    available: true,
    createdAt: Date.now() - 1000 * 3600 * 24 * 2,
    updatedAt: Date.now() - 1000 * 3600 * 24 * 2,
  },
  {
    id: 'm10',
    name: 'Glazed Meyer Lemon Tart',
    description: 'Crisp almond sand pastry case shell filled with tangy lemon whipped mousse, caramelized peaks of fluffy Italian organic meringue.',
    price: 850, // £8.50
    category: 'desserts',
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=80',
    allergens: ['Gluten', 'Eggs', 'Milk', 'Nuts'],
    available: true,
    createdAt: Date.now() - 1000 * 3600 * 3,
    updatedAt: Date.now() - 1000 * 3600 * 3,
  }
];

export const CATEGORY_FALLBACK_IMAGES = {
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
  drinks: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
  desserts: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80'
};
