import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PLAYLIST = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "SynthWave AI",
    duration: "3:45",
    color: "var(--color-neon-cyan)",
    cover: "https://picsum.photos/seed/neon1/400/400"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Digital Soul",
    duration: "4:12",
    color: "var(--color-neon-pink)",
    cover: "https://picsum.photos/seed/neon2/400/400"
  },
  {
    id: 3,
    title: "Midnight Grid",
    artist: "Vector Flow",
    duration: "2:58",
    color: "var(--color-neon-purple)",
    cover: "https://picsum.photos/seed/neon3/400/400"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 0.5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="w-full max-w-md bg-dark-surface/80 backdrop-blur-xl rounded-[40px] p-8 neon-border-pink relative overflow-hidden flex flex-col gap-6">
      <div className="scanline" style={{ background: 'rgba(255, 0, 255, 0.1)' }} />
      
      {/* Album Art */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden group">
        <motion.img
          key={currentTrack.id}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={currentTrack.cover}
          alt={currentTrack.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Spinning Disc Effect */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Disc className="text-neon-pink drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]" size={32} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 right-4">
          <motion.h3 
            key={`title-${currentTrack.id}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold text-white tracking-tight"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            key={`artist-${currentTrack.id}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 0.6 }}
            className="text-sm font-mono uppercase tracking-widest text-white/60"
          >
            {currentTrack.artist}
          </motion.p>
        </div>
      </div>

      {/* Visualizer Mock */}
      <div className="flex items-end justify-between h-12 px-2 gap-1">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: isPlaying ? [10, Math.random() * 40 + 10, 10] : 10
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full bg-neon-pink/40 rounded-t-sm"
            style={{ backgroundColor: isPlaying ? currentTrack.color : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-pink shadow-[0_0_10px_rgba(255,0,255,0.8)]"
            style={{ backgroundColor: currentTrack.color, width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <span>0:00</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4">
        <button className="text-white/40 hover:text-white transition-colors">
          <Volume2 size={20} />
        </button>
        
        <div className="flex items-center gap-8">
          <button 
            onClick={handlePrev}
            className="text-white/60 hover:text-neon-pink transition-colors active:scale-90"
          >
            <SkipBack size={28} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-white/60 hover:text-neon-pink transition-colors active:scale-90"
          >
            <SkipForward size={28} fill="currentColor" />
          </button>
        </div>

        <button className="text-white/40 hover:text-white transition-colors">
          <Music2 size={20} />
        </button>
      </div>
    </div>
  );
}
