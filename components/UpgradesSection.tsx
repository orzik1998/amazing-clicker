import React, { useState } from 'react';
import { GameState, UpgradeItem, GiftItem } from '../types';
import { UPGRADES, GIFTS } from '../constants';
import { ChevronRight, Lock } from 'lucide-react';

interface UpgradesSectionProps {
  state: GameState;
  onBuyUpgrade: (upgrade: UpgradeItem) => void;
  onBuyGift: (gift: GiftItem) => void;
}

export const UpgradesSection: React.FC<UpgradesSectionProps> = ({ state, onBuyUpgrade, onBuyGift }) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'gifts'>('skills');

  const getUpgradeCost = (upgrade: UpgradeItem) => {
    const level = state.purchasedUpgrades[upgrade.id] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(1.5, level));
  };

  return (
    <div className="flex flex-col h-full pt-6 px-4 pb-24 overflow-y-auto page-enter">
      <h2 className="text-2xl font-bold mb-4 text-center drop-shadow-md">Магазин</h2>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-800/60 backdrop-blur-md rounded-xl mb-6 sticky top-0 z-20 shadow-xl border border-white/5">
        <button
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'skills' 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('skills')}
        >
          Улучшения
        </button>
        <button
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'gifts' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('gifts')}
        >
          Подарки
        </button>
      </div>

      <div className="flex justify-center mb-6">
         <div className="bg-slate-900/60 backdrop-blur-md px-6 py-2 rounded-full border border-yellow-500/30 flex items-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <span className="text-slate-300 text-sm font-medium">Баланс:</span>
            <span className="text-yellow-400 font-bold text-lg">{Math.floor(state.coins).toLocaleString()}</span>
            <img src="https://cdn-icons-png.flaticon.com/512/12117/12117188.png" className="w-5 h-5" alt="coin" />
         </div>
      </div>

      {activeTab === 'skills' ? (
        <div className="grid gap-3">
          {UPGRADES.map((upgrade) => {
            const currentLevel = state.purchasedUpgrades[upgrade.id] || 0;
            const cost = getUpgradeCost(upgrade);
            const canAfford = state.coins >= cost;

            return (
              <div 
                key={upgrade.id}
                className={`flex items-center p-3 rounded-2xl border transition-all duration-200 ${
                  canAfford 
                    ? 'bg-slate-800/60 hover:bg-slate-700/80 border-slate-600/50 backdrop-blur-sm' 
                    : 'bg-slate-900/40 border-slate-800/50 opacity-60'
                }`}
              >
                <div className="w-14 h-14 flex items-center justify-center text-3xl bg-slate-900/80 rounded-xl mr-4 border border-white/5 shadow-inner">
                  {upgrade.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-white truncate pr-2">{upgrade.name}</h3>
                    <span className="text-[10px] font-bold text-indigo-200 bg-indigo-900/50 px-2 py-0.5 rounded-full border border-indigo-500/30">Lvl {currentLevel}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{upgrade.description}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-blue-300">
                    {upgrade.type === 'click' ? '👆' : '⏱️'} +{upgrade.baseEffect}
                  </div>
                </div>

                <button
                  onClick={() => canAfford && onBuyUpgrade(upgrade)}
                  disabled={!canAfford}
                  className={`ml-3 px-3 py-2 rounded-xl text-sm font-bold flex flex-col items-center min-w-[85px] transition-all active:scale-95 ${
                    canAfford 
                      ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-900/40 border-t border-blue-400/20' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1 text-xs">
                    <img src="https://cdn-icons-png.flaticon.com/512/12117/12117188.png" className="w-3 h-3 grayscale opacity-70" alt="" />
                    {cost.toLocaleString()}
                  </span>
                  <span className="text-[10px] uppercase mt-0.5 opacity-80">купить</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
           {GIFTS.map((gift) => {
             const canAfford = state.coins >= gift.cost;
             const owned = state.inventory.includes(gift.id);
             
             return (
               <div key={gift.id} className={`flex flex-col p-4 rounded-2xl border transition-all ${owned ? 'bg-gradient-to-br from-green-900/40 to-slate-900/80 border-green-500/30' : 'bg-slate-800/60 border-slate-700/50 backdrop-blur-sm'} relative overflow-hidden group`}>
                  {owned && (
                    <div className="absolute top-2 right-2 text-green-400 bg-green-900/50 rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  )}
                  <div className="w-full aspect-square flex items-center justify-center text-6xl mb-3 bg-slate-900/50 rounded-full shadow-inner border border-white/5">
                    {gift.icon}
                  </div>
                  <h3 className="font-bold text-center text-white mb-1">{gift.name}</h3>
                  <p className={`text-[10px] uppercase text-center mb-3 font-bold tracking-wider ${
                    gift.rarity === 'legendary' ? 'text-yellow-400' :
                    gift.rarity === 'rare' ? 'text-purple-400' : 'text-slate-400'
                  }`}>
                    {gift.rarity}
                  </p>
                  
                  <button
                    onClick={() => !owned && canAfford && onBuyGift(gift)}
                    disabled={!canAfford || owned}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
                      owned 
                        ? 'bg-transparent text-green-400 cursor-default border border-green-500/30'
                        : canAfford 
                          ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:brightness-110 active:scale-95' 
                          : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {owned ? 'В КОЛЛЕКЦИИ' : `${(gift.cost / 1000).toFixed(0)}K`}
                  </button>
               </div>
             )
           })}
           <div className="col-span-2 p-6 mt-4 bg-slate-800/30 rounded-2xl border border-dashed border-slate-600 text-center text-slate-400 text-sm backdrop-blur-sm">
             Больше подарков скоро...
           </div>
        </div>
      )}
    </div>
  );
};