"use client";

import { useState } from "react";
import ConversationMode from "@/components/conversation/ConversationMode";

export default function NewConversationPage() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <main className="h-[calc(100vh-80px)] w-full flex flex-col bg-surface overflow-hidden">
      {/* Small header for the mode */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>settings_voice</span>
          <h1 className="text-primary font-bold font-display text-xl">Conversation</h1>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden">
        <ConversationMode 
          isRecording={isRecording}
          onMicClick={() => setIsRecording(!isRecording)}
          primaryText="Hello, how are you today?"
          secondaryText="Hola, ¿cómo estás hoy?"
        />
      </div>
    </main>
  );
}
