/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 md:p-8 gap-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase italic neon-glow-cyan mb-2">
          Neon <span className="text-neon-pink neon-glow-pink">Beats</span>
        </h1>
        <p className="text-white/40 font-mono text-xs uppercase tracking-[0.5em]">
          Retro Arcade • Synthwave Experience
        </p>
      </motion.header>

      {/* Main Content */}
      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-12 z-10">
        {/* Left Side - Info/Stats (Optional) */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex flex-col gap-6 text-left"
        >
          <div className="p-6 border-l-2 border-neon-cyan bg-white/5 backdrop-blur-sm">
            <h2 className="text-neon-cyan font-mono text-sm uppercase tracking-widest mb-2 font-bold">System Status</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Arcade core initialized. Neural synth-link established. 
              Ready for high-frequency input.
            </p>
          </div>
          <div className="p-6 border-l-2 border-neon-pink bg-white/5 backdrop-blur-sm">
            <h2 className="text-neon-pink font-mono text-sm uppercase tracking-widest mb-2 font-bold">Audio Engine</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              3 AI-generated tracks loaded. Dynamic visualizer active. 
              Spatial audio processing enabled.
            </p>
          </div>
        </motion.div>

        {/* Center - Snake Game */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <SnakeGame />
        </motion.div>

        {/* Right Side - Music Player */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <MusicPlayer />
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-white/20 font-mono text-[10px] uppercase tracking-widest flex gap-8"
      >
        <span>Built with React & Tailwind</span>
        <span>•</span>
        <span>© 2026 Neon Beats Arcade</span>
      </motion.footer>
    </div>
  );
}
