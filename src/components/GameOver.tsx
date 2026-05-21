import { ArrowLeft, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { i18n } from '../i18n';
import { playClick } from '../audio';

export function GameOver({ score, onReplay, onMenu }: { score: number, onReplay: () => void, onMenu: () => void }) {
  const { highScore, language } = useStore();
  const t = i18n[language];
  const isNewRecord = score > highScore && score > 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#050212]/80 backdrop-blur-md z-50">
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_0_40px_rgba(219,39,119,0.15)] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none"></div>
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500 mb-2 relative z-10">
          {score > 50 ? t.unstoppable : (score > 20 ? t.crashMaster : t.gameOver)}
        </h2>
        
        {isNewRecord && (
          <span className="bg-pink-500/20 text-pink-400 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-6 border border-pink-500/30 relative z-10">
            {t.newRecord}
          </span>
        )}

        <div className="bg-white/5 w-full rounded-2xl py-6 mb-8 border border-white/10 relative z-10">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{t.totalScore}</p>
          <p className="text-6xl font-black font-mono text-white text-shadow-sm">{score}</p>
        </div>

        <div className="w-full space-y-4 relative z-10">
          <button 
            onClick={() => { playClick(); onReplay(); }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-red-600 hover:brightness-110 text-white p-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-transform active:scale-95 shadow-[0_0_20px_rgba(219,39,119,0.3)]"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{t.playAgain}</span>
          </button>
          
          <button 
            onClick={() => { playClick(); onMenu(); }}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur text-white p-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-transform active:scale-95 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t.menu}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
