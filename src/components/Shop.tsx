import { ArrowLeft, Check, Lock } from 'lucide-react';
import { useStore, store } from '../store';
import { SKINS, SCENES } from '../types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Shop({ onBack }: { onBack: () => void }) {
  const { coins, unlockedSkins, unlockedScenes, currentSkinId, currentSceneId } = useStore();
  const [tab, setTab] = useState<'skins' | 'scenes'>('skins');

  const handleBuySkin = (id: string, price: number) => {
    if (coins >= price && !unlockedSkins.includes(id)) {
      store.setState({ 
        coins: coins - price, 
        unlockedSkins: [...unlockedSkins, id],
        currentSkinId: id
      });
    }
  };

  const handleBuyScene = (id: string, price: number) => {
    if (coins >= price && !unlockedScenes.includes(id)) {
      store.setState({ 
        coins: coins - price, 
        unlockedScenes: [...unlockedScenes, id],
        currentSceneId: id
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-transparent flex flex-col z-40">
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#050212]/80 backdrop-blur-xl sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition">
          <ArrowLeft className="w-6 h-6 text-gray-300" />
        </button>
        <span className="font-bold text-xl uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500">Garage</span>
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur px-3 py-1.5 rounded-full text-yellow-400 font-mono font-bold text-sm border border-yellow-500/30">
          💰 {coins}
        </div>
      </div>

      <div className="flex px-4 pt-4 gap-2 border-b border-white/10 bg-[#050212]/50 backdrop-blur">
        <button 
          onClick={() => setTab('skins')} 
          className={`flex-1 py-3 rounded-t-xl font-bold uppercase tracking-widest text-xs transition ${tab === 'skins' ? 'bg-white/10 text-white border-t border-x border-white/10' : 'bg-transparent text-gray-500 hover:bg-white/5'}`}
        >
          Engines
        </button>
        <button 
          onClick={() => setTab('scenes')} 
          className={`flex-1 py-3 rounded-t-xl font-bold uppercase tracking-widest text-xs transition ${tab === 'scenes' ? 'bg-white/10 text-white border-t border-x border-white/10' : 'bg-transparent text-gray-500 hover:bg-white/5'}`}
        >
          Scenery
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-transparent p-4 pb-20 no-scrollbar">
        <AnimatePresence mode="wait">
          {tab === 'skins' ? (
            <motion.div key="skins" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
              {SKINS.map(skin => {
                const isUnlocked = unlockedSkins.includes(skin.id);
                const isEquipped = currentSkinId === skin.id;
                
                return (
                  <div key={skin.id} className={`flex items-center p-4 rounded-2xl backdrop-blur-md border ${isEquipped ? 'border-pink-500/50 bg-pink-500/10 shadow-[0_0_15px_rgba(219,39,119,0.2)]' : 'border-white/10 bg-white/5'}`}>
                    <div className="text-5xl w-16 h-16 flex items-center justify-center bg-slate-900/80 rounded-xl mr-4 shrink-0 border border-white/5">
                      {skin.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-100">{skin.name}</h3>
                      {!isUnlocked && <p className="text-xs text-yellow-500 font-mono mt-1">💰 {skin.price}</p>}
                    </div>
                    <div className="shrink-0">
                      {isEquipped ? (
                        <div className="px-4 py-2 bg-pink-500/20 text-pink-400 font-bold text-xs uppercase tracking-widest rounded-xl border border-pink-500/30 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Equipped
                        </div>
                      ) : isUnlocked ? (
                        <button onClick={() => store.setState({ currentSkinId: skin.id })} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition border border-white/10">
                          Equip
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleBuySkin(skin.id, skin.price)}
                          disabled={coins < skin.price}
                          className={`px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-xl transition flex items-center gap-1 ${coins >= skin.price ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg hover:brightness-110' : 'bg-white/5 text-gray-500 opacity-50 border border-white/5'}`}
                        >
                          <Lock className="w-3 h-3" /> Unlock
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div key="scenes" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
              {SCENES.map(scene => {
                const isUnlocked = unlockedScenes.includes(scene.id);
                const isEquipped = currentSceneId === scene.id;
                
                return (
                  <div key={scene.id} className={`flex items-center p-4 rounded-2xl backdrop-blur-md border ${isEquipped ? 'border-pink-500/50 bg-pink-500/10 shadow-[0_0_15px_rgba(219,39,119,0.2)]' : 'border-white/10 bg-white/5'}`}>
                    <div className="w-16 h-16 rounded-xl mr-4 shrink-0 border border-white/20 relative overflow-hidden">
                       <div className="absolute inset-0" style={{ backgroundColor: scene.color, opacity: 0.6 }} />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-100">{scene.name}</h3>
                      {!isUnlocked && <p className="text-xs text-yellow-500 font-mono mt-1">💰 {scene.price}</p>}
                    </div>
                    <div className="shrink-0">
                      {isEquipped ? (
                        <div className="px-4 py-2 bg-pink-500/20 text-pink-400 font-bold text-xs uppercase tracking-widest rounded-xl border border-pink-500/30 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Equipped
                        </div>
                      ) : isUnlocked ? (
                        <button onClick={() => store.setState({ currentSceneId: scene.id })} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition border border-white/10">
                          Equip
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleBuyScene(scene.id, scene.price)}
                          disabled={coins < scene.price}
                          className={`px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-xl transition flex items-center gap-1 ${coins >= scene.price ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg hover:brightness-110' : 'bg-white/5 text-gray-500 opacity-50 border border-white/5'}`}
                        >
                          <Lock className="w-3 h-3" /> Unlock
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
