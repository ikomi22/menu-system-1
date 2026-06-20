import type { MenuItem, RestaurantConfig } from './types';

import { config as arcoConfig, categoryFallbacks as arcoCategoryFallbacks } from '../restaurants/arco/config';
import { menuItems as arcoMenuItems } from '../restaurants/arco/menu';
import { config as blueOrchidConfig, categoryFallbacks as blueOrchidCategoryFallbacks } from '../restaurants/blue-orchid/config';
import { menuItems as blueOrchidMenuItems } from '../restaurants/blue-orchid/menu';
import { config as aquaConfig, categoryFallbacks as aquaCategoryFallbacks } from '../restaurants/aqua/config';
import { menuItems as aquaMenuItems } from '../restaurants/aqua/menu';
import { config as entreeConfig, categoryFallbacks as entreeCategoryFallbacks } from '../restaurants/entree-steakhouse/config';
import { menuItems as entreeMenuItems } from '../restaurants/entree-steakhouse/menu';
import { config as oliveTreeConfig, categoryFallbacks as oliveTreeCategoryFallbacks } from '../restaurants/olive-tree/config';
import { menuItems as oliveTreeMenuItems } from '../restaurants/olive-tree/menu';

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
  aqua: {
    config: aquaConfig,
    menuItems: aquaMenuItems,
    categoryFallbacks: aquaCategoryFallbacks,
  },
  'entree-steakhouse': {
    config: entreeConfig,
    menuItems: entreeMenuItems,
    categoryFallbacks: entreeCategoryFallbacks,
  },
  'olive-tree': {
    config: oliveTreeConfig,
    menuItems: oliveTreeMenuItems,
    categoryFallbacks: oliveTreeCategoryFallbacks,
  },
};

const id = import.meta.env.VITE_RESTAURANT_ID || 'arco';
const restaurant = registry[id] ?? registry.arco;

export const DEFAULT_CONFIG = restaurant.config;
export const DEFAULT_MENU_ITEMS = restaurant.menuItems;
export const CATEGORY_FALLBACK_IMAGES = restaurant.categoryFallbacks;
