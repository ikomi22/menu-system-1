import type { RestaurantConfig } from '../../src/types';

export const config: RestaurantConfig = {
  name: 'Olive Tree',
  logo: '/olive-tree/logo.png',           // TODO: confirm file exists + extension
  primaryColour: '#000000',               // TODO: update from brand assets
  accentColour: '#000000',               // TODO: update from brand assets
  uiAccentColour: '#000000',             // TODO: must be light enough to read on dark cards (lesson #9)
  backgroundImage: '/olive-tree/hero.jpg',
  welcomeMessage: 'TODO',
  pin: '1234',
  lastUpdated: Date.now(),
};

export const categoryFallbacks: Record<string, string> = {
  // TODO: add one entry per category once categories are confirmed from menu source
};
