import React, { useState, useCallback, useRef } from 'react';
import { GameState, FloatingText } from '../types';
import { HamsterScene } from './HamsterScene';

interface ClickerSectionProps {
  state: GameState;
  onTap: (x: number, y: number) => void;
}

export const ClickerSection: React.FC<ClickerSectionProps> = ({ state, onTap }) => {
  const [clicks, setClicks] = useState<FloatingText[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click logic
  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Determine coordinates
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    // Visual squash effect state for 3D model
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    // Add floating text
    const newClick: FloatingText = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
      value: state.clickPower
    };

    setClicks(prev => [...prev, newClick]);
    
    // Trigger game logic
    onTap(clientX, clientY);

    // Cleanup floating text
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== newClick.id));
    }, 800);
  }, [state.clickPower, onTap]);

  return (
    <div className="flex flex-col items-center h-full pt-10 px-4 relative overflow-hidden select-none">
      
      {/* Stats Header */}
      <div className="flex flex-col items-center mb-4 gap-2 w-full max-w-sm relative z-20 pointer-events-none">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-sm flex items-center gap-2">
          <img src="https://cdn-icons-png.flaticon.com/512/12117/12117188.png" className="w-10 h-10 drop-shadow-md" alt="coin" />
          {Math.floor(state.coins).toLocaleString()}
        </h1>
        <div className="flex justify-between w-full px-4 text-slate-200 text-sm font-medium bg-slate-800/40 p-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider opacity-70">Прибыль за клик</span>
            <span className="text-blue-300 font-bold">+{state.clickPower}</span>
          </div>
          <div className="w-px bg-white/10 h-8"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider opacity-70">Пассивный доход</span>
            <span className="text-green-300 font-bold">+{state.passiveIncome}/сек</span>
          </div>
        </div>
      </div>

      {/* 3D Character Container */}
      <div 
        ref={containerRef}
        className="relative flex-1 w-full z-10 cursor-pointer touch-none outline-none"
        onClick={handleClick}
        // Important: Prevent scrolling on touch devices while tapping fast
        style={{ touchAction: 'none', WebkitTapHighlightColor: 'transparent' }}
      >
        <div className="absolute inset-0">
            <HamsterScene isPressed={isPressed} />
        </div>
        
        {/* Floating Badge in 3D space overlay */}
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 pointer-events-none z-20">
           <div className="bg-yellow-500/90 backdrop-blur-sm text-black font-black px-4 py-1 rounded-full border-2 border-yellow-200 shadow-lg whitespace-nowrap transform hover:scale-105 transition-transform">
              LEVEL {(state.coins / 1000).toFixed(0)}
           </div>
        </div>
      </div>

      {/* Floating Numbers Container */}
      {clicks.map(click => (
        <div
          key={click.id}
          className="absolute text-4xl font-bold text-white pointer-events-none float-animation z-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center gap-1"
          style={{ left: click.x, top: click.y - 80 }}
        >
          <img src="https://cdn-icons-png.flaticon.com/512/12117/12117188.png" className="w-6 h-6" alt="" />
          +{click.value}
        </div>
      ))}

      {/* Energy Bar */}
      <div className="w-full max-w-sm h-4 bg-slate-900/60 backdrop-blur-sm rounded-full mt-4 overflow-hidden mb-24 border border-white/10 shadow-inner z-20 pointer-events-none">
        <div className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 w-full animate-pulse shadow-[0_0_15px_rgba(251,146,60,0.6)]"></div>
      </div>
    </div>
  );
};