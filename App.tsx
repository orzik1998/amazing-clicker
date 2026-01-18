import React, { useState, useEffect, useCallback } from 'react';
import { GameState, View, UpgradeItem, TaskItem, GiftItem } from './types';
import { INITIAL_STATE } from './constants';
import { BottomNav } from './components/BottomNav';
import { ClickerSection } from './components/ClickerSection';
import { UpgradesSection } from './components/UpgradesSection';
import { TasksSection } from './components/TasksSection';
import { SettingsSection } from './components/SettingsSection';

const STORAGE_KEY = 'hamster_evo_save_v1';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);

  // Load game state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setGameState(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
    setLoaded(true);
  }, []);

  // Save game state
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState, loaded]);

  // Passive Income Loop
  useEffect(() => {
    if (gameState.passiveIncome === 0) return;

    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        coins: prev.coins + prev.passiveIncome
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.passiveIncome]);

  // Game Actions
  const handleTap = useCallback((x: number, y: number) => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + prev.clickPower
    }));
    
    // Haptics simulation (if supported by browser/device)
    if (gameState.settings.haptics && navigator.vibrate) {
        navigator.vibrate(10);
    }
  }, [gameState.clickPower, gameState.settings.haptics]);

  const handleBuyUpgrade = (upgrade: UpgradeItem) => {
    setGameState(prev => {
        const currentLevel = prev.purchasedUpgrades[upgrade.id] || 0;
        const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, currentLevel));

        if (prev.coins < cost) return prev;

        const newState = {
            ...prev,
            coins: prev.coins - cost,
            purchasedUpgrades: {
                ...prev.purchasedUpgrades,
                [upgrade.id]: currentLevel + 1
            }
        };

        // Apply stats immediately
        if (upgrade.type === 'click') {
            newState.clickPower += upgrade.baseEffect;
        } else {
            newState.passiveIncome += upgrade.baseEffect;
        }

        return newState;
    });
  };

  const handleBuyGift = (gift: GiftItem) => {
     setGameState(prev => {
         if (prev.coins < gift.cost) return prev;
         return {
             ...prev,
             coins: prev.coins - gift.cost,
             inventory: [...prev.inventory, gift.id]
         };
     });
  };

  const handleCompleteTask = (task: TaskItem) => {
      if (gameState.completedTasks.includes(task.id)) return;
      
      // Open link if exists
      if (task.url && task.url !== '#') {
          window.open(task.url, '_blank');
      }

      // In a real app, we verify completion. Here we simulate it.
      // Delay reward slightly to simulate "checking"
      setTimeout(() => {
        setGameState(prev => ({
            ...prev,
            coins: prev.coins + task.reward,
            completedTasks: [...prev.completedTasks, task.id]
        }));
        alert(`Задание выполнено! Получено ${task.reward.toLocaleString()} монет.`);
      }, 500);
  };

  const handleUpdateSettings = (key: keyof GameState['settings']) => {
      setGameState(prev => ({
          ...prev,
          settings: {
              ...prev.settings,
              [key]: !prev.settings[key]
          }
      }));
  };

  const handleUpdateUsername = (name: string) => {
      setGameState(prev => ({ ...prev, username: name }));
  };

  const handleReset = () => {
      if(confirm("Вы уверены? Весь прогресс будет потерян.")) {
          setGameState(INITIAL_STATE);
          localStorage.removeItem(STORAGE_KEY);
      }
  };

  if (!loaded) return <div className="h-screen w-full bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="h-[100dvh] w-full text-white font-sans overflow-hidden flex flex-col relative">
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-aurora z-[-1]"></div>
      
      {/* Floating Particles (Simulated with simple divs for performance) */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse z-[-1]"></div>
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000 z-[-1]"></div>

      {/* Dynamic Content Area */}
      <main className="flex-1 overflow-hidden relative z-10">
        {currentView === 'home' && (
            <ClickerSection state={gameState} onTap={handleTap} />
        )}
        {currentView === 'upgrades' && (
            <UpgradesSection 
                state={gameState} 
                onBuyUpgrade={handleBuyUpgrade} 
                onBuyGift={handleBuyGift} 
            />
        )}
        {currentView === 'tasks' && (
            <TasksSection state={gameState} onCompleteTask={handleCompleteTask} />
        )}
        {currentView === 'settings' && (
            <SettingsSection 
                state={gameState} 
                onUpdateSettings={handleUpdateSettings} 
                onUpdateUsername={handleUpdateUsername}
                onReset={handleReset}
            />
        )}
      </main>

      {/* Sticky Bottom Navigation */}
      <BottomNav currentView={currentView} onChangeView={setCurrentView} />
    </div>
  );
}