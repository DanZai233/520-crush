export type GameState = 'menu' | 'playing' | 'gameover' | 'shop' | 'leaderboard';

export interface Skin {
  id: string;
  name: string;
  emoji: string;
  price: number;
}

export interface Scene {
  id: string;
  name: string;
  color: string;
  price: number;
}

export const SKINS: Skin[] = [
  { id: 'classic', name: '经典火车', emoji: '🚂', price: 0 },
  { id: 'bullet', name: '复兴长龙', emoji: '🚄', price: 100 },
  { id: 'steam', name: '老式蒸汽', emoji: '🚋', price: 300 },
  { id: 'tractor', name: '狂暴泥头车', emoji: '🚛', price: 800 },
  { id: 'rocket', name: '单身火箭', emoji: '🚀', price: 2000 },
];

export const SCENES: Scene[] = [
  { id: 'city', name: '城市街道', color: '#374151', price: 0 }, // gray-700
  { id: 'park', name: '恋爱公园', color: '#166534', price: 500 }, // green-800
  { id: 'night', name: '伤心夜色', color: '#172554', price: 1500 }, // blue-950
];
