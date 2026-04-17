"use client";

import { useState, useRef } from "react";
import ConversationMode from "@/components/conversation/ConversationMode";
import AudioRecorder from "@/components/AudioRecorder";

export default function NewConversationPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSource, setRecordingSource] = useState<"primary" | "secondary" | null>(null);
  const [primaryText, setPrimaryText] = useState("Hold the mic to speak");
  const [secondaryText, setSecondaryText] = useState("Mantén presionado el micro para hablar");
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const primaryLang = "English";
  const secondaryLang = "Spanish";

  const handleRecordingComplete = async (blob: Blob) => {
    if (!recordingSource) return;

    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append("audio", blob);
      
      // Determine source and target languages based on who spoke
      const sourceLang = recordingSource === "primary" ? primaryLang : secondaryLang;
      const targetLang = recordingSource === "primary" ? secondaryLang : primaryLang;

      formData.append("sourceLang", sourceLang);
      formData.append("targetLang", targetLang);

      const response = await fetch("/api/process-turn", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process conversation turn");

      const result = await response.json();

      // Update the UI with the result
      if (recordingSource === "primary") {
        setPrimaryText(result.transcript);
        setSecondaryText(result.translatedText);
      } else {
        setSecondaryText(result.transcript);
        setPrimaryText(result.translatedText);
      }

      // Play the translated audio
      if (result.audioUrl) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(result.audioUrl);
        audioRef.current = audio;
        await audio.play();
      }
    } catch (error) {
      console.error("Error processing turn:", error);
      const msg = "Error processing speech. Please try again.";
      if (recordingSource === "primary") setPrimaryText(msg);
      else setSecondaryText(msg);
    } finally {
      setIsLoading(false);
      setRecordingSource(null);
    }
  };

  return (
    <main className="h-[calc(100vh-80px)] w-full flex flex-col bg-surface overflow-hidden">
      <AudioRecorder 
        onRecordingComplete={handleRecordingComplete}
        onRecordingStateChange={setIsRecording}
      >
        {({ startRecording, stopRecording }) => (
          <div className="flex-1 relative overflow-hidden">
            <ConversationMode 
              isRecording={isRecording}
              recordingSource={recordingSource}
              onMicStart={(source) => {
                setRecordingSource(source);
                startRecording();
              }}
              onMicEnd={() => {
                stopRecording();
              }}
              primaryText={isLoading && recordingSource === "primary" ? "Processing..." : primaryText}
              secondaryText={isLoading && recordingSource === "secondary" ? "Procesando..." : secondaryText}
              primaryLang={`${primaryLang} (US)`}
              secondaryLang={`${secondaryLang} (ES)`}
            />
          </div>
        )}
      </AudioRecorder>
    </main>
  );
}
