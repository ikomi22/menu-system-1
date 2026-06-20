import type { MenuItem, RestaurantConfig } from './types';

import { config as arcoConfig, categoryFallbacks as arcoCategoryFallbacks } from '../restaurants/arco/config';
import { menuItems as arcoMenuItems } from '../restaurants/arco/menu';
import { config as blueOrchidConfig, categoryFallbacks as blueOrchidCategoryFallbacks } from '../restaurants/blue-orchid/config';
import { menuItems as blueOrchidMenuItems } from '../restaurants/blue-orchid/menu';

type RestaurantEntry = {
  config: RestaurantConfig;
  menuItems: MenuItem[];
  categoryFallbacks: Record<string, string>;
};

const registry: Record<string, RestaurantEntry> = {
  arco: {
    config: arcoConfig,
    menuItems: arcoMenuItems,
    categoryFallbacks: arcoCategoryFallbacks,
  },
  'blue-orchid': {
    config: blueOrchidConfig,
    menuItems: blueOrchidMenuItems,
    categoryFallbacks: blueOrchidCategoryFallbacks,
  },
};

const id = import.meta.env.VITE_RESTAURANT_ID || 'arco';
const restaurant = registry[id] ?? registry.arco;

export const DEFAULT_CONFIG = restaurant.config;
export const DEFAULT_MENU_ITEMS = restaurant.menuItems;
export const CATEGORY_FALLBACK_IMAGES = restaurant.categoryFallbacks;
