import { ArrowLeft, Trophy } from 'lucide-react';
import { useStore } from '../store';
import { motion } from 'motion/react';

export function Leaderboard({ onBack }: { onBack: () => void }) {
  const { highScore } = useStore();

  return (
    <div className="absolute inset-0 bg-transparent flex flex-col z-40">
      <div className="p-4 flex items-center border-b border-white/10 bg-[#050212]/80 backdrop-blur-xl sticky top-0">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition">
          <ArrowLeft className="w-6 h-6 text-gray-300" />
        </button>
        <span className="font-bold text-xl ml-4 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500">Rankings</span>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/60 backdrop-blur-xl w-full max-w-sm rounded-3xl p-8 border border-pink-500/20 text-center shadow-[0_0_40px_rgba(219,39,119,0.15)] mt-12 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none"></div>
          
          <Trophy className="w-20 h-20 text-pink-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)] relative z-10" />
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 relative z-10">Your Best Score</h2>
          <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-pink-300 to-pink-600 drop-shadow-sm font-mono mt-4 relative z-10">
            {highScore}
          </div>
          
          <div className="mt-12 text-xs font-medium text-pink-300/80 bg-pink-500/10 border border-pink-500/20 p-4 rounded-xl relative z-10 uppercase tracking-widest">
            Destroy 52 couples to awaken the truth.
          </div>
        </motion.div>
        
        {/* Fake leaderboard for theme matching */}
        <div className="w-full max-w-sm mt-8 space-y-3">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-4 rounded-xl border-l-4 border-pink-500 border-t border-r border-b border-white/5">
            <div className="w-6 text-xs text-pink-500 font-bold">01</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">FF_Loner_4Ever</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">9,999,999 pts</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/5">
            <div className="w-6 text-xs text-gray-500 font-bold">02</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-300">SingleDogKing</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">8,520,333 pts</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/5">
            <div className="w-6 text-xs text-gray-500 font-bold">03</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-300">AntiCupid_99</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">7,440,001 pts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
