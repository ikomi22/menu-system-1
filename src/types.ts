/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = string;

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in pence
  category: Category;
  imageUrl: string;
  allergens: string[]; // List of official UK allergens
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  available: boolean;
  pairedItemIds?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface RestaurantConfig {
  name: string;
  logo: string; // Base64 or URL
  primaryColour: string; // hex — CTA button backgrounds only
  accentColour: string; // hex
  uiAccentColour?: string; // hex — text, icons, borders, active states
  backgroundImage?: string; // welcome screen hero image path
  welcomeMessage: string;
  pin: string;
  lastUpdated: number;
}

export const OFFICIAL_ALLERGENS = [
  'Celery',
  'Gluten',
  'Crustaceans',
  'Eggs',
  'Fish',
  'Lupin',
  'Milk',
  'Molluscs',
  'Mustard',
  'Nuts',
  'Peanuts',
  'Sesame',
  'Soya',
  'Sulphites'
] as const;

export type AllergenType = typeof OFFICIAL_ALLERGENS[number];
