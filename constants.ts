import { GiftItem, TaskItem, UpgradeItem } from './types';

export const UPGRADES: UpgradeItem[] = [
  {
    id: 'strong_finger',
    name: 'Strong Finger',
    description: 'Increases coins per click',
    baseCost: 50,
    baseEffect: 1,
    type: 'click',
    icon: '👆',
  },
  {
    id: 'auto_clicker',
    name: 'Auto Clicker Bot',
    description: 'Passive income per second',
    baseCost: 200,
    baseEffect: 5,
    type: 'passive',
    icon: '🤖',
  },
  {
    id: 'energy_drink',
    name: 'Energy Drink',
    description: 'Boosts click efficiency',
    baseCost: 1000,
    baseEffect: 5,
    type: 'click',
    icon: '⚡',
  },
  {
    id: 'crypto_mining',
    name: 'Crypto Mining Rig',
    description: 'High passive income',
    baseCost: 5000,
    baseEffect: 50,
    type: 'passive',
    icon: '💻',
  },
  {
    id: 'ai_trader',
    name: 'AI Trader',
    description: 'Massive passive income',
    baseCost: 20000,
    baseEffect: 250,
    type: 'passive',
    icon: '🧠',
  },
];

export const TASKS: TaskItem[] = [
  {
    id: 'amazing_online',
    title: 'Скачать "Амазинг Онлайн"',
    reward: 100000,
    icon: '🚗',
    actionText: 'Download',
    url: '#',
  },
  {
    id: 'register_game',
    title: 'Регистрация в игре',
    reward: 100000,
    icon: '🎮',
    actionText: 'Register',
    url: '#',
  },
  {
    id: 'subscribe_channel',
    title: 'Подпишись на канал',
    reward: 5000,
    icon: '📢',
    actionText: 'Subscribe',
    url: '#',
  },
  {
    id: 'invite_friend',
    title: 'Пригласи друга',
    reward: 25000,
    icon: '🤝',
    actionText: 'Invite',
  },
];

export const GIFTS: GiftItem[] = [
  {
    id: 'star',
    name: 'Telegram Star',
    cost: 500000,
    icon: '⭐',
    rarity: 'common',
  },
  {
    id: 'teddy',
    name: 'Blue Teddy',
    cost: 1000000,
    icon: '🧸',
    rarity: 'rare',
  },
  {
    id: 'dragon',
    name: 'Red Dragon',
    cost: 5000000,
    icon: '🐉',
    rarity: 'legendary',
  },
];

export const INITIAL_STATE = {
  coins: 0,
  clickPower: 1,
  passiveIncome: 0,
  username: 'CryptoHamster',
  settings: {
    sound: true,
    music: false,
    haptics: true,
  },
  completedTasks: [],
  purchasedUpgrades: {},
  inventory: [],
};