import { useEffect, useState } from 'react';

type StoreState = {
  highScore: number;
  coins: number;
  unlockedSkins: string[];
  unlockedScenes: string[];
  currentSkinId: string;
  currentSceneId: string;
};

const defaultState: StoreState = {
  highScore: 0,
  coins: 0,
  unlockedSkins: ['classic'],
  unlockedScenes: ['city'],
  currentSkinId: 'classic',
  currentSceneId: 'city',
};

let memoryState: StoreState = { ...defaultState };

try {
  const saved = localStorage.getItem('520_game_state');
  if (saved) {
    memoryState = { ...memoryState, ...JSON.parse(saved) };
  }
} catch (e) {
  console.error("Local storage error", e);
}

const listeners = new Set<() => void>();

export const store = {
  getState: () => memoryState,
  setState: (partial: Partial<StoreState>) => {
    memoryState = { ...memoryState, ...partial };
    try {
      localStorage.setItem('520_game_state', JSON.stringify(memoryState));
    } catch(e) {}
    listeners.forEach(l => l());
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  }
};

export const useStore = () => {
  const [state, setState] = useState(store.getState());
  useEffect(() => store.subscribe(() => setState(store.getState())), []);
  return state;
};
