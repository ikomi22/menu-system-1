import React from 'react';
import { Category } from '../types';

interface FoodAnimationProps {
  category: Category;
  variant?: 'card' | 'hero';
}

function SteamParticles({ variant }: { variant: 'card' | 'hero' }) {
  const size = variant === 'hero' ? [10, 8, 12, 9, 11] : [6, 5, 8, 6, 7];
  const duration = variant === 'hero' ? '2.8s' : '2.2s';
  const positions = [22, 35, 50, 65, 78];
  const delays = ['0s', '0.5s', '1.0s', '1.5s', '2.0s'];
  const bottoms = ['15%', '10%', '18%', '12%', '16%'];

  return (
    <>
      {positions.map((left, i) => (
        <div
          key={i}
          className="food-anim-particle"
          style={{
            width: size[i],
            height: size[i],
            left: `${left}%`,
            bottom: bottoms[i],
            background: 'rgba(255,255,255,0.32)',
            animation: `steam-rise ${duration} ease-in infinite`,
            animationDelay: delays[i],
          }}
        />
      ))}
    </>
  );
}

function CondensationParticles({ variant }: { variant: 'card' | 'hero' }) {
  const w = variant === 'hero' ? 6 : 5;
  const h = variant === 'hero' ? 10 : 8;
  const positions = [5, 15, 80, 90];
  const delays = ['0s', '0.7s', '1.4s', '2.1s'];
  const tops = ['18%', '30%', '22%', '35%'];

  return (
    <>
      {positions.map((left, i) => (
        <div
          key={i}
          className="food-anim-particle"
          style={{
            width: w,
            height: h,
            left: `${left}%`,
            top: tops[i],
            background: 'rgba(180,220,255,0.55)',
            animation: `condense-drop 2.8s ease-in infinite`,
            animationDelay: delays[i],
          }}
        />
      ))}
    </>
  );
}

function SparkleParticles({ variant }: { variant: 'card' | 'hero' }) {
  const size = variant === 'hero' ? 5 : 3;
  const scatter = [
    { top: '20%', left: '30%' },
    { top: '70%', left: '20%' },
    { top: '50%', left: '60%' },
    { top: '30%', left: '70%' },
    { top: '75%', left: '65%' },
  ];
  const delays = ['0s', '0.35s', '0.7s', '1.05s', '1.4s'];

  return (
    <>
      {scatter.map((pos, i) => (
        <div
          key={i}
          className="food-anim-particle"
          style={{
            width: size,
            height: size,
            top: pos.top,
            left: pos.left,
            background: '#A83A35',
            boxShadow: '0 0 4px #A83A35',
            animation: `sparkle-pulse 1.8s ease-in-out infinite`,
            animationDelay: delays[i],
          }}
        />
      ))}
    </>
  );
}

export default function FoodAnimation({ category, variant = 'card' }: FoodAnimationProps) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {(category === 'starters' || category === 'mains' || category === 'pasta' || category === 'pizza') && (
        <SteamParticles variant={variant} />
      )}
      {category === 'drinks' && <CondensationParticles variant={variant} />}
      {category === 'desserts' && <SparkleParticles variant={variant} />}
    </div>
  );
}
