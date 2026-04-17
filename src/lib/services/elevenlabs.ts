import elevenlabs from "@/lib/elevenlabs";

/**
 * Real ElevenLabs Service
 */
export async function synthesizeSpeech(text: string, voiceId?: string): Promise<string> {
  try {
    let selectedVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID;
    
    if (!selectedVoiceId) {
      // Fallback to first available voice if none configured
      const voices = await elevenlabs.voices.getAll();
      if (!voices.voices[0]) throw new Error("No voices found in account");
      selectedVoiceId = voices.voices[0].voiceId;
    }

    const audioStream = await elevenlabs.textToSpeech.convert(selectedVoiceId, {
      text,
      modelId: "eleven_multilingual_v2",
    });

    const arrayBuffer = await new Response(audioStream).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert Buffer to Base64 Data URL for easy frontend playback
    return `data:audio/mpeg;base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("ElevenLabs Synthesis Error:", error);
    throw new Error("Failed to synthesize speech");
  }
}
