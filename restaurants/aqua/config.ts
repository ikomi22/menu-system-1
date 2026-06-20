import type { RestaurantConfig } from '../../src/types';

export const config: RestaurantConfig = {
  name: 'Aqua Food & Mood',
  logo: '/aqua/logo.png',
  primaryColour: '#PLACEHOLDER',   // brand colour — buttons only, never text
  accentColour: '#PLACEHOLDER',
  uiAccentColour: '#PLACEHOLDER',  // dark accent for admin UI
  backgroundImage: '/aqua/hero.jpg',
  welcomeMessage: 'Authentic Lebanese cuisine, fresh ingredients and warm hospitality.',
  pin: '1234',
  lastUpdated: Date.now(),
};

export const categoryFallbacks: Record<string, string> = {
  // populate once categories are confirmed from the menu PDF
};
