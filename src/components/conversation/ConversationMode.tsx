"use client";

import React from "react";

interface ConversationModeProps {
  primaryText?: string;
  secondaryText?: string;
  isRecording?: boolean;
  onMicClick?: () => void;
  primaryLang?: string;
  secondaryLang?: string;
}

export default function ConversationMode({
  primaryText = "Hello, how are you today? I love this place.",
  secondaryText = "Hola, ¿cómo estás hoy? Me encanta este lugar.",
  isRecording = false,
  onMicClick,
  primaryLang = "English (US)",
  secondaryLang = "Spanish (ES)",
}: ConversationModeProps) {
  return (
    <div className="flex-1 flex flex-col relative w-full max-w-5xl mx-auto md:px-6 md:pb-6 h-full overflow-hidden">
      {/* Top Half: Secondary Person (Rotated 180deg for face-to-face interaction) */}
      <div className="flex-1 flex flex-col justify-between p-6 rotate-180 bg-surface-low md:rounded-3xl shadow-[0_16px_32px_rgba(0,0,0,0.2)] z-10 relative">
        <div className="flex items-center justify-between w-full">
          <button className="flex items-center gap-2 bg-surface-variant/60 backdrop-blur-[20px] px-4 py-2 rounded-full hover:bg-surface-variant transition-colors group mt-4">
            <span className="text-xl">👩🏽</span>
            <div className="flex flex-col items-start text-left">
              <span className="font-sans text-[10px] uppercase tracking-wider text-secondary opacity-80">AI Voice</span>
              <span className="font-sans text-sm font-medium text-on-surface leading-tight">{secondaryLang}</span>
            </div>
            <span className="material-symbols-outlined text-secondary text-[20px] group-hover:text-on-surface transition-colors">expand_more</span>
          </button>
          <button className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-secondary hover:bg-pulse/10 transition-colors">
            <span className="material-symbols-outlined text-[20px]">keyboard</span>
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center py-8 px-4">
          <p className="font-display text-3xl md:text-5xl text-on-surface text-center leading-tight tracking-tight">
            {secondaryText}
          </p>
        </div>
      </div>

      {/* Center Shared Mic Button */}
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 top-1/2">
        <button 
          onClick={onMicClick}
          className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center shadow-[0_0_32px_rgba(208,188,255,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 ${isRecording ? 'animate-pulse' : ''}`}
        >
          <span className="material-symbols-outlined text-[44px] md:text-[52px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isRecording ? 'stop' : 'mic'}
          </span>
        </button>
      </div>

      {/* Bottom Half: Primary User */}
      <div className="flex-1 flex flex-col justify-between p-6 bg-surface pb-28 md:pb-6 relative md:rounded-b-3xl">
        <div className="flex-1 flex flex-col items-center justify-center py-8 px-4 gap-6">
          <div className="font-display text-3xl md:text-5xl text-on-surface text-center leading-tight tracking-tight">
            {primaryText.split('?').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}{i < arr.length - 1 ? '?' : ''}
                {i === 0 && <br />}
              </React.Fragment>
            ))}
          </div>
          
          {/* Custom Waveform Visualizer */}
          <div className="flex items-end justify-center gap-1.5 h-10 mt-2">
            {[0.6, 0.8, 1, 0.9, 0.8, 0.7, 0.5].map((opacity, i) => (
              <div 
                key={i}
                className={`w-1.5 rounded-full ${i % 2 === 0 ? 'bg-tertiary' : 'bg-primary'} animate-wave-bar`}
                style={{ 
                  height: `${[16, 28, 40, 24, 32, 20, 12][i]}px`,
                  opacity,
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between w-full mt-auto">
          <button className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center text-secondary hover:bg-pulse/10 transition-colors">
            <span className="material-symbols-outlined text-[20px]">keyboard</span>
          </button>
          <button className="flex items-center gap-2 bg-surface-variant/60 backdrop-blur-[20px] px-4 py-2 rounded-full hover:bg-surface-variant transition-colors group">
            <div className="flex flex-col items-end text-right">
              <span className="font-sans text-[10px] uppercase tracking-wider text-secondary opacity-80">AI Voice</span>
              <span className="font-sans text-sm font-medium text-on-surface leading-tight">{primaryLang}</span>
            </div>
            <span className="text-xl">👨🏻</span>
            <span className="material-symbols-outlined text-secondary text-[20px] group-hover:text-on-surface transition-colors">expand_more</span>
          </button>
        </div>
      </div>
    </div>
  );
}
