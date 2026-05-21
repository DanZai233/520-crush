import { GameState } from './types';
import { MainMenu } from './components/MainMenu';
import { Game } from './components/Game';
import { GameOver } from './components/GameOver';
import { Shop } from './components/Shop';
import { Leaderboard } from './components/Leaderboard';
import { useState } from 'react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [lastScore, setLastScore] = useState(0);

  return (
    <div className="w-full h-full min-h-screen bg-[#050212] flex flex-col overflow-hidden text-white font-sans touch-none select-none relative">
       {/* Atmospheric Background Glows */}
       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

       <div className="absolute inset-0 z-10 flex flex-col">
         {gameState === 'menu' && (
           <MainMenu
             onPlay={() => setGameState('playing')}
             onShop={() => setGameState('shop')}
             onLeaderboard={() => setGameState('leaderboard')}
           />
         )}
         {gameState === 'playing' && (
           <Game
             onGameOver={(score) => {
               setLastScore(score);
               setGameState('gameover');
             }}
             onMenu={() => setGameState('menu')}
           />
         )}
         {gameState === 'gameover' && (
           <GameOver
             score={lastScore}
             onReplay={() => setGameState('playing')}
             onMenu={() => setGameState('menu')}
           />
         )}
         {gameState === 'shop' && <Shop onBack={() => setGameState('menu')} />}
         {gameState === 'leaderboard' && <Leaderboard onBack={() => setGameState('menu')} />}
       </div>

       {/* Visual Overlay for Immersion */}
       <div className="absolute inset-0 pointer-events-none border-[8px] md:border-[16px] border-black/20 z-50"></div>
       <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(5,2,18,0.4)_100%)] z-40"></div>
    </div>
  );
}
