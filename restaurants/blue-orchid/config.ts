import type { RestaurantConfig } from '../../src/types';

export const config: RestaurantConfig = {
  name: 'Blue Orchid',
  logo: '/blue-orchid/logo.png',
  primaryColour: '#C4922A',
  accentColour: '#1A1A2E',
  uiAccentColour: '#C4922A',
  backgroundImage: '/blue-orchid/massaman-curry.jpg',
  welcomeMessage: 'Authentic Thai & Indian cuisine, crafted with passion since 2006.',
  pin: '1234',
  lastUpdated: Date.now(),
};

export const categoryFallbacks: Record<string, string> = {
  'thai-starters':   'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop&q=80',
  'soups':           'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&auto=format&fit=crop&q=80',
  'salads':          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
  'thai-curries':    '/blue-orchid/massaman-curry.jpg',
  'stir-fried':      '/blue-orchid/pad-nam-prik-pao.jpg',
  'thai-grill':      'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=800&auto=format&fit=crop&q=80',
  'thai-specials':   '/blue-orchid/lime-ginger-sea-bass.jpg',
  'vegetables':      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
  'noodles-rice':    '/blue-orchid/pad-thai.jpg',
  'indian-starters': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
  'indian-mains':    '/blue-orchid/chicken-jalfrezi.jpg',
  'indian-specials': '/blue-orchid/rogon-josh.jpg',
  'indian-seafood':  '/blue-orchid/lime-ginger-sea-bass.jpg',
  'biryani':         '/blue-orchid/desi-biryani.jpg',
  'indian-veg':      '/blue-orchid/paneer-masala.jpg',
  'sides':           'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80',
};
