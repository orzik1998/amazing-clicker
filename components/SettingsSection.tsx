import React, { useState } from 'react';
import { GameState } from '../types';
import { User, Volume2, VolumeX, Music, Smartphone, Edit2, Check } from 'lucide-react';

interface SettingsSectionProps {
  state: GameState;
  onUpdateSettings: (key: keyof GameState['settings']) => void;
  onUpdateUsername: (name: string) => void;
  onReset: () => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ state, onUpdateSettings, onUpdateUsername, onReset }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(state.username);

  const handleSaveName = () => {
    onUpdateUsername(editName);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full pt-6 px-4 pb-24 overflow-y-auto page-enter">
      <h2 className="text-2xl font-bold mb-6 text-center drop-shadow-md">Настройки</h2>

      {/* User Profile */}
      <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 mb-6 flex flex-col items-center border border-white/5 shadow-xl">
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full mb-4 flex items-center justify-center text-4xl shadow-lg border-4 border-slate-800">
           🐹
        </div>
        
        {isEditing ? (
            <div className="flex items-center gap-2 w-full max-w-[200px]">
                <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-slate-900/80 border border-blue-500 rounded-lg px-3 py-1 text-center text-white w-full focus:outline-none shadow-inner"
                    autoFocus
                />
                <button onClick={handleSaveName} className="p-1.5 bg-green-600 rounded-lg hover:bg-green-500 text-white shadow-lg">
                    <Check size={18} />
                </button>
            </div>
        ) : (
            <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{state.username}</h3>
                <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-white transition-colors bg-white/5 p-1 rounded-md">
                    <Edit2 size={14} />
                </button>
            </div>
        )}
        <div className="mt-2 px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
             <p className="text-yellow-300 text-xs font-bold">Level {(Object.values(state.purchasedUpgrades) as number[]).reduce((a, b) => a + b, 0)} Boss</p>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 mb-8">
        {[
          { key: 'sound', label: 'Звуки', icon: state.settings.sound ? <Volume2 size={20} /> : <VolumeX size={20} />, color: 'blue' },
          { key: 'music', label: 'Музыка', icon: <Music size={20} />, color: 'purple' },
          { key: 'haptics', label: 'Вибрация', icon: <Smartphone size={20} />, color: 'green' }
        ].map((item) => (
            <button 
              key={item.key}
              onClick={() => onUpdateSettings(item.key as keyof GameState['settings'])}
              className="w-full flex items-center justify-between p-4 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/5 active:scale-[0.98] transition-all shadow-lg"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${
                        state.settings[item.key as keyof GameState['settings']] 
                        ? `bg-${item.color}-500/20 text-${item.color}-400` 
                        : 'bg-slate-700/50 text-slate-400'
                    }`}>
                        {item.icon}
                    </div>
                    <span className="font-medium text-slate-200">{item.label}</span>
                </div>
                
                {/* Switch Toggle UI */}
                <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${
                    state.settings[item.key as keyof GameState['settings']] 
                    ? `bg-${item.color}-600` 
                    : 'bg-slate-600/50'
                }`}>
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                        state.settings[item.key as keyof GameState['settings']] 
                        ? 'translate-x-5' 
                        : 'translate-x-0'
                    }`} />
                </div>
            </button>
        ))}
      </div>

      <button 
        onClick={onReset}
        className="w-full py-4 text-red-400 font-medium hover:bg-red-500/10 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-colors"
      >
        Сбросить прогресс
      </button>

      <div className="mt-8 text-center text-slate-500 text-xs font-mono opacity-50">
         v1.0.0 • Hamster Evo
      </div>
    </div>
  );
};