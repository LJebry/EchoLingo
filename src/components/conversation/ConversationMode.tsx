"use client";

import React, { useState } from "react";

interface ConversationModeProps {
  primaryText?: string;
  secondaryText?: string;
  isRecording?: boolean;
  recordingSource?: "primary" | "secondary" | null;
  onMicStart?: (source: "primary" | "secondary") => void;
  onMicEnd?: () => void;
  primaryLang?: string;
  secondaryLang?: string;
}

export default function ConversationMode({
  primaryText = "Hold the mic to speak",
  secondaryText = "Mantén presionado el micro para hablar",
  isRecording = false,
  recordingSource = null,
  onMicStart,
  onMicEnd,
  primaryLang = "English (US)",
  secondaryLang = "Spanish (ES)",
}: ConversationModeProps) {
  const [activeTouch, setActiveTouch] = useState<"primary" | "secondary" | null>(null);

  const handleStart = (source: "primary" | "secondary") => {
    setActiveTouch(source);
    onMicStart?.(source);
  };

  const handleEnd = () => {
    setActiveTouch(null);
    onMicEnd?.();
  };

  const Waveform = ({ active }: { active: boolean }) => (
    <div className={`flex items-end justify-center gap-1.5 h-10 mt-2 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-20'}`}>
      {[0.6, 0.8, 1, 0.9, 0.8, 0.7, 0.5].map((opacity, i) => (
        <div 
          key={i}
          className={`w-1.5 rounded-full ${i % 2 === 0 ? 'bg-tertiary' : 'bg-primary'} ${active ? 'animate-wave-bar' : ''}`}
          style={{ 
            height: `${[16, 28, 40, 24, 32, 20, 12][i]}px`,
            opacity: active ? opacity : 0.2,
            animationDelay: `${i * 100}ms`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col relative w-full max-w-5xl mx-auto md:px-6 md:pb-6 h-full overflow-hidden select-none">
      {/* Top Half: Primary Person (Person 1) - Rotated 180deg */}
      <div className={`flex-1 flex flex-col justify-between p-6 rotate-180 transition-colors duration-500 ${recordingSource === 'primary' ? 'bg-pulse/10' : 'bg-surface-low'} md:rounded-3xl shadow-[0_16px_32px_rgba(0,0,0,0.2)] z-10 relative`}>
        <div className="flex items-center justify-between w-full">
          <button className="flex items-center gap-2 bg-surface-variant/60 backdrop-blur-[20px] px-4 py-2 rounded-full hover:bg-surface-variant transition-colors group mt-4">
            <span className="text-xl">👨🏻</span>
            <div className="flex flex-col items-start text-left">
              <span className="font-sans text-[10px] uppercase tracking-wider text-secondary opacity-80">AI Voice</span>
              <span className="font-sans text-sm font-medium text-on-surface leading-tight">{primaryLang}</span>
            </div>
            <span className="material-symbols-outlined text-secondary text-[20px] group-hover:text-on-surface transition-colors">expand_more</span>
          </button>
          <button className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-secondary hover:bg-pulse/10 transition-colors">
            <span className="material-symbols-outlined text-[20px]">keyboard</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 gap-4">
          <p className="font-display text-3xl md:text-5xl text-on-surface text-center leading-tight tracking-tight">
            {primaryText}
          </p>
          <Waveform active={isRecording && recordingSource === "primary"} />
        </div>
      </div>

      {/* Center Shared Mic Button with Dual Halves */}
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 top-1/2">
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          <div className={`absolute inset-0 rounded-full bg-primary/20 blur-2xl transition-opacity duration-300 ${isRecording ? 'opacity-100 scale-125' : 'opacity-0'}`} />
          
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-full border-4 border-outline-variant/20 bg-surface-low shadow-[0_0_50px_rgba(0,0,0,0.28)]">
            {/* Top Half Button (triggers Top Person / Primary) */}
            <button
              onMouseDown={() => handleStart("primary")}
              onMouseUp={handleEnd}
              onMouseLeave={activeTouch === "primary" ? handleEnd : undefined}
              onTouchStart={(e) => { e.preventDefault(); handleStart("primary"); }}
              onTouchEnd={handleEnd}
              className={`flex-1 w-full flex items-center justify-center transition-colors ${activeTouch === "primary" ? 'bg-primary text-on-primary' : 'bg-transparent text-primary hover:bg-primary/10'}`}
            >
              <span className="material-symbols-outlined text-[40px] md:text-[48px] rotate-180" style={{ fontVariationSettings: "'FILL' 1" }}>
                mic
              </span>
            </button>

            {/* Divider */}
            <div className="h-0.5 w-full bg-outline-variant/20" />

            {/* Bottom Half Button (triggers Bottom Person / Secondary) */}
            <button
              onMouseDown={() => handleStart("secondary")}
              onMouseUp={handleEnd}
              onMouseLeave={activeTouch === "secondary" ? handleEnd : undefined}
              onTouchStart={(e) => { e.preventDefault(); handleStart("secondary"); }}
              onTouchEnd={handleEnd}
              className={`flex-1 w-full flex items-center justify-center transition-colors ${activeTouch === "secondary" ? 'bg-primary text-on-primary' : 'bg-transparent text-primary hover:bg-primary/10'}`}
            >
              <span className="material-symbols-outlined text-[40px] md:text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                mic
              </span>
            </button>
          </div>
          
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-20 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Bottom Half: Secondary Person (Person 2) */}
      <div className={`flex-1 flex flex-col justify-between p-6 transition-colors duration-500 ${recordingSource === 'secondary' ? 'bg-pulse/10' : 'bg-surface'} pb-28 md:pb-6 relative md:rounded-b-3xl`}>
        <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 gap-4">
          <p className="font-display text-3xl md:text-5xl text-on-surface text-center leading-tight tracking-tight">
            {secondaryText}
          </p>
          <Waveform active={isRecording && recordingSource === "secondary"} />
        </div>

        <div className="flex items-center justify-between w-full mt-auto">
          <button className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-secondary hover:bg-pulse/10 transition-colors">
            <span className="material-symbols-outlined text-[20px]">keyboard</span>
          </button>
          <button className="flex items-center gap-2 bg-surface-variant/60 backdrop-blur-[20px] px-4 py-2 rounded-full hover:bg-surface-variant transition-colors group">
            <div className="flex flex-col items-end text-right">
              <span className="font-sans text-[10px] uppercase tracking-wider text-secondary opacity-80">AI Voice</span>
              <span className="font-sans text-sm font-medium text-on-surface leading-tight">{secondaryLang}</span>
            </div>
            <span className="text-xl">👩🏽</span>
            <span className="material-symbols-outlined text-secondary text-[20px] group-hover:text-on-surface transition-colors">expand_more</span>
          </button>
        </div>
      </div>
    </div>
  );
}
