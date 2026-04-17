"use client";

/**
 * MEDIA RECORDER API
 * This is how you access the microphone in the browser.
 * 1. Use 'navigator.mediaDevices.getUserMedia({ audio: true })'
 * 2. Use 'new MediaRecorder(stream)' to capture data.
 * 3. Collect 'chunks' of audio data and turn them into a 'Blob' when finished.
 */
export default function AudioRecorder({ onRecordingComplete }: { onRecordingComplete: (blob: Blob) => void }) {
  // TODO: Implement start/stop logic and 'blob' emission
  return (
    <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400">
      <button className="bg-blue-600 text-white p-4 rounded-full">
        Mic Button Logic Goes Here
      </button>
    </div>
  );
}
