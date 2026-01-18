import React from 'react';
import { Pickaxe, Home, ClipboardList, Settings } from 'lucide-react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'home', label: 'Главная', icon: <Home size={24} /> },
    { view: 'upgrades', label: 'Улучшения', icon: <Pickaxe size={24} /> },
    { view: 'tasks', label: 'Задания', icon: <ClipboardList size={24} /> },
    { view: 'settings', label: 'Настройки', icon: <Settings size={24} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg border-t border-white/5 pb-safe pt-2 px-2 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
      <div className="flex justify-around items-center pb-4">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onChangeView(item.view)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-20 ${
              currentView === item.view
                ? 'text-blue-400 bg-white/5 scale-105'
                : 'text-slate-500 hover:text-slate-300 active:scale-95'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};