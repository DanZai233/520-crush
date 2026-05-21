let context: AudioContext | null = null;
const getContext = () => {
    if (!context) {
        context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (context.state === 'suspended') {
        context.resume();
    }
    return context;
};

function playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1, endFreq?: number) {
  try {
      const ctx = getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (endFreq) {
          osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
  } catch(e) {}
}

// 创飞情侣的音效
export const playCrash = () => {
    playTone(150, 'sawtooth', 0.3, 0.3, 50);
    setTimeout(() => playTone(100, 'square', 0.2, 0.3, 30), 50);
};

// 碰到障碍物音效
export const playHitObstacle = () => {
    playTone(100, 'square', 0.3, 0.5, 40);
};

// 吃金币
export const playCoin = () => {
    playTone(800, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(1200, 'sine', 0.15, 0.1), 80);
};

// 吃道具
export const playPowerup = () => {
    playTone(400, 'triangle', 0.1, 0.15, 600);
    setTimeout(() => playTone(600, 'triangle', 0.1, 0.15, 800), 100);
    setTimeout(() => playTone(800, 'triangle', 0.2, 0.15, 1200), 200);
};

// Ui点击
export const playClick = () => playTone(600, 'sine', 0.05, 0.05);

// 游戏结束
export const playGameOver = () => {
    playTone(300, 'sawtooth', 0.3, 0.2, 200);
    setTimeout(() => playTone(250, 'sawtooth', 0.3, 0.2, 150), 250);
    setTimeout(() => playTone(200, 'sawtooth', 0.5, 0.2, 50), 500);
};
