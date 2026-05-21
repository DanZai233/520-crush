import React, { useEffect, useRef, useState } from 'react';
import { useStore, store } from '../store';
import { SCENES, SKINS } from '../types';
import { Pause, Play, Zap } from 'lucide-react';

type Track = 0 | 1 | 2;
type EntityType = 'couple' | 'obstacle' | 'coin' | 'invincible';

interface GameEntity {
  id: number;
  type: EntityType;
  track: Track;
  y: number; // 0 (top) to 1 (bottom)
  hit: boolean;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  emoji: string;
  xPos?: number;
}

export function Game({ onGameOver, onMenu }: { onGameOver: (score: number) => void, onMenu: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { currentSkinId, currentSceneId, coins, highScore } = useStore();
  const currentSkin = SKINS.find(s => s.id === currentSkinId) || SKINS[0];
  const currentScene = SCENES.find(s => s.id === currentSceneId) || SCENES[0];
  
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);

  // refs for game loop to avoid re-renders
  const state = useRef({
    track: 1 as Track,
    renderX: 1, // for smooth lane change animation
    score: 0,
    coins: 0,
    speed: 0.8, // base speed
    distance: 0,
    nextSpawn: 0.5,
    entities: [] as GameEntity[],
    invincibleTime: 0,
    gameOver: false,
    entityId: 0,
  });

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  // Input handling
  const touchStartX = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    touchStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (state.current.gameOver || isPaused) return;
    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = endX - touchStartX.current;
    
    if (diff > 40 && state.current.track < 2) {
      state.current.track = (state.current.track + 1) as Track;
    } else if (diff < -40 && state.current.track > 0) {
      state.current.track = (state.current.track - 1) as Track;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.current.gameOver || isPaused) return;
      if (e.key === 'ArrowRight' || e.key === 'd') {
        if (state.current.track < 2) state.current.track = (state.current.track + 1) as Track;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        if (state.current.track > 0) state.current.track = (state.current.track - 1) as Track;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused]);

  // Main loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    const spawnRow = () => {
      // Logic for spawning stuff in 3 tracks
      const tracks: Track[] = [0, 1, 2];
      
      // We must leave at least one track open
      const emptyTrack = Math.floor(Math.random() * 3);
      
      tracks.forEach(track => {
        if (track !== emptyTrack && Math.random() > 0.4) {
          // spawn obstacle
          state.current.entities.push({
            id: state.current.entityId++,
            type: 'obstacle', track, y: -0.1, hit: false,
            vx: 0, vy: 0, rot: 0, vrot: 0, emoji: '🚧'
          });
        } else {
          // chance for couple or coin
          const r = Math.random();
          if (r < 0.4) {
            state.current.entities.push({
              id: state.current.entityId++,
              type: 'couple', track, y: -0.1, hit: false,
              vx: 0, vy: 0, rot: 0, vrot: 0, emoji: '💑'
            });
          } else if (r < 0.7) {
            state.current.entities.push({
              id: state.current.entityId++,
              type: 'coin', track, y: -0.1, hit: false,
              vx: 0, vy: 0, rot: 0, vrot: 0, emoji: '💰'
            });
          } else if (r < 0.72) {
            state.current.entities.push({
              id: state.current.entityId++,
              type: 'invincible', track, y: -0.1, hit: false,
              vx: 0, vy: 0, rot: 0, vrot: 0, emoji: '⭐'
            });
          }
        }
      });
    };

    const update = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (!isPaused && !state.current.gameOver) {
        // smooth train movement
        state.current.renderX += (state.current.track - state.current.renderX) * 15 * deltaTime;
        
        // speed up over time
        state.current.speed = 0.8 + (state.current.distance * 0.05);
        if (state.current.speed > 2.5) state.current.speed = 2.5; // max speed

        state.current.distance += state.current.speed * deltaTime;
        
        if (state.current.invincibleTime > 0) {
          state.current.invincibleTime -= deltaTime;
        }

        if (state.current.distance > state.current.nextSpawn) {
          spawnRow();
          state.current.nextSpawn = state.current.distance + 0.4;
        }
        
        const trainY = 0.8;
        const hitboxRadius = 0.05;

        // update entities
        for (let i = state.current.entities.length - 1; i >= 0; i--) {
          const ent = state.current.entities[i];
          
          if (ent.hit) {
            // physics for hit things
            ent.xPos! += ent.vx * deltaTime;
            ent.y += ent.vy * deltaTime;
            ent.vy += 2 * deltaTime; // gravity
            ent.rot += ent.vrot * deltaTime;
            if (ent.y > 1.2) state.current.entities.splice(i, 1);
            continue;
          }

          ent.y += state.current.speed * deltaTime;
          
          // Collision Check
          if (ent.y > trainY - hitboxRadius && ent.y < trainY + hitboxRadius) {
             // We check actual track index, but allow a tiny bit of horizontal leeway
             // If renderX is close to ent.track (within 0.5)
             if (Math.abs(state.current.renderX - ent.track) < 0.6) {
                if (ent.type === 'couple') {
                  ent.hit = true;
                  ent.emoji = '💔';
                  ent.vx = (Math.random() - 0.5) * 2;
                  ent.vy = -1.5;
                  ent.vrot = (Math.random() - 0.5) * 10;
                  ent.xPos = ent.track;
                  state.current.score += 1;
                  setScore(state.current.score);
                } else if (ent.type === 'coin') {
                  ent.hit = true;
                  ent.emoji = '✨';
                  ent.vx = 0; ent.vy = -2; ent.vrot = 5;
                  ent.xPos = ent.track;
                  state.current.coins += 1;
                  setSessionCoins(state.current.coins);
                } else if (ent.type === 'invincible') {
                   ent.hit = true;
                   ent.emoji = '🛡️';
                   ent.vx = 0; ent.vy = -2; ent.xPos = ent.track;
                   state.current.invincibleTime = 5; // 5 seconds
                } else if (ent.type === 'obstacle') {
                  if (state.current.invincibleTime > 0) {
                     ent.hit = true;
                     ent.emoji = '💥';
                     ent.vx = (Math.random() - 0.5) * 2;
                     ent.vy = -1.5;
                     ent.vrot = (Math.random() - 0.5) * 5;
                     ent.xPos = ent.track;
                     state.current.score += 2; // bonus for destroying
                     setScore(state.current.score);
                  } else {
                     // GAMEOVER
                     state.current.gameOver = true;
                     setTimeout(() => {
                        // save stats
                        const finalScore = state.current.score;
                        const globalState = store.getState();
                        const totalCoins = globalState.coins + state.current.coins;
                        store.setState({ 
                          coins: totalCoins,
                          highScore: Math.max(globalState.highScore, finalScore)
                        });
                        onGameOver(finalScore);
                     }, 1000);
                  }
                }
             }
          }
          
          if (ent.y > 1.2 && !ent.hit) {
            state.current.entities.splice(i, 1);
          }
        }
      }

      // Draw
      const w = canvas.width;
      const h = canvas.height;
      const trackWidth = w / 3;
      
      // We clear with transparent to show through App.tsx background,
      // or we can draw the scene color with some transparency
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = currentScene.color;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1.0;
      
      // Draw grid/tracks moving
      ctx.strokeStyle = 'rgba(236,72,153,0.3)'; // pink-500/30
      ctx.lineWidth = 2;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * trackWidth, 0);
        ctx.lineTo(i * trackWidth, h);
        ctx.stroke();
      }

      // draw ties (horizontal lines)
      const tieSpacing = h * 0.15;
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      const offset = (state.current.distance * h) % tieSpacing;
      for (let y = offset - tieSpacing; y < h; y += tieSpacing) {
         ctx.beginPath();
         ctx.moveTo(0, y);
         ctx.lineTo(w, y);
         ctx.stroke();
      }
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw entities
      for (const ent of state.current.entities) {
         let x = (ent.xPos !== undefined ? ent.xPos : ent.track) * trackWidth + trackWidth / 2;
         let y = ent.y * h;
         
         ctx.save();
         ctx.translate(x, y);
         if (ent.hit) ctx.rotate(ent.rot);
         
         let size = h * 0.08;
         ctx.font = `${size}px sans-serif`;
         ctx.fillText(ent.emoji, 0, 0);
         ctx.restore();
      }

      // Draw Train
      ctx.save();
      const trainX = state.current.renderX * trackWidth + trackWidth / 2;
      const trainY = 0.8 * h;
      
      // shake if invincible
      let shakeX = 0;
      if (state.current.invincibleTime > 0) {
        shakeX = (Math.random() - 0.5) * 10;
        ctx.shadowColor = 'yellow';
        ctx.shadowBlur = 20;
      }

      ctx.translate(trainX + shakeX, trainY);
      
      // wobble scaling
      const bounce = Math.sin(time * 0.01) * 0.05 + 1;
      ctx.scale(bounce, bounce);
      if (state.current.gameOver) {
         ctx.filter = 'grayscale(100%)';
      }
      
      ctx.font = `${h * 0.08}px sans-serif`;
      ctx.fillText(currentSkin.emoji, 0, 0);
      ctx.restore();

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isPaused, currentScene, currentSkin, onGameOver]);

  return (
    <div 
      className="absolute inset-0 bg-transparent touch-none"
      ref={containerRef}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} className="w-full h-full block mix-blend-screen" />
      
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10">
         <div className="flex gap-4 items-center bg-slate-900/50 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl pointer-events-auto shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Points</p>
              <p className="text-xl font-mono text-pink-400 flex items-center justify-center gap-1">
                💔 {score}
              </p>
            </div>
            <div className="w-[1px] h-8 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Coins</p>
              <p className="text-xl font-mono text-yellow-400">
                💰 {sessionCoins}
              </p>
            </div>
         </div>
         
         <div className="flex gap-2 pointer-events-auto">
            {state.current.invincibleTime > 0 && (
               <div className="bg-pink-600/20 backdrop-blur-md border border-pink-500/50 px-4 py-2 rounded-xl flex items-center gap-2 animate-pulse text-pink-400 font-bold shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                 <Zap className="w-5 h-5 fill-current" />
                 <span className="text-xs uppercase tracking-widest">Power MAX</span>
               </div>
            )}

            <button 
              onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
              className="bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 p-3 rounded-xl transition text-white shadow-lg"
            >
              {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </button>
         </div>
      </div>

      {isPaused && (
        <div className="absolute inset-0 bg-[#050212]/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
           <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-500 mb-8 uppercase tracking-widest drop-shadow-lg">System Paused</h2>
           <div className="space-y-4 w-64">
             <button onClick={() => setIsPaused(false)} className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:brightness-110 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-widest flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(219,39,119,0.3)] transition-all">
               <Play className="w-5 h-5 fill-current" /> RESUME
             </button>
             <button onClick={onMenu} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-xl flex justify-center text-sm uppercase tracking-widest transition-all">
               ABORT MISSION
             </button>
           </div>
        </div>
      )}
    </div>
  );
}
