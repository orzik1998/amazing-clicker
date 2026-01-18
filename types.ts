export type View = 'home' | 'upgrades' | 'tasks' | 'settings';

export interface GameState {
  coins: number;
  clickPower: number;
  passiveIncome: number;
  username: string;
  settings: {
    sound: boolean;
    music: boolean;
    haptics: boolean;
  };
  completedTasks: string[];
  purchasedUpgrades: Record<string, number>; // id -> level
  inventory: string[]; // List of gift IDs
}

export interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseEffect: number;
  type: 'click' | 'passive';
  icon: string;
  maxLevel?: number;
}

export interface TaskItem {
  id: string;
  title: string;
  reward: number;
  icon: string;
  actionText: string;
  url?: string;
}

export interface GiftItem {
  id: string;
  name: string;
  cost: number;
  icon: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  value: number;
}