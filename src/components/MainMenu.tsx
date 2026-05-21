import { Play, Store, Trophy } from 'lucide-react';
import { useStore } from '../store';
import { motion } from 'motion/react';

export function MainMenu({ onPlay, onShop, onLeaderboard }: { onPlay: () => void, onShop: () => void, onLeaderboard: () => void }) {
  const { coins, highScore } = useStore();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-transparent">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12 flex flex-col items-center gap-4"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)] mb-2">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500 drop-shadow-lg">
            520 撞大运
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-pink-300/60 mt-2">Lover's Collision Simulator</p>
        </div>
      </motion.div>

      <div className="flex gap-4 mb-12 text-center bg-slate-900/50 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl shadow-xl">
        <div className="min-w-20">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Top Score</p>
          <p className="text-2xl font-bold font-mono text-pink-400">{highScore}</p>
        </div>
        <div className="w-[1px] bg-white/10 self-stretch my-2"></div>
        <div className="min-w-20">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Coins</p>
          <p className="text-2xl font-bold font-mono text-yellow-500">{coins}</p>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <button 
          onClick={onPlay}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 to-red-600 hover:brightness-110 text-white p-4 rounded-2xl font-bold text-xl uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_20px_rgba(219,39,119,0.3)]"
        >
          <Play className="fill-current w-6 h-6" />
          <span>GO CRASHING!</span>
        </button>

        <div className="flex gap-4">
          <button 
            onClick={onShop}
            className="flex-1 flex flex-col items-center justify-center gap-2 bg-white/5 backdrop-blur-md hover:bg-white/10 p-4 rounded-2xl transition-all active:scale-95 border border-white/10 text-gray-300 hover:text-white"
          >
            <Store className="w-6 h-6 text-pink-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Garage</span>
          </button>

          <button 
            onClick={onLeaderboard}
            className="flex-1 flex flex-col items-center justify-center gap-2 bg-white/5 backdrop-blur-md hover:bg-white/10 p-4 rounded-2xl transition-all active:scale-95 border border-white/10 text-gray-300 hover:text-white"
          >
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Rankings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
