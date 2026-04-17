import elevenlabs from "@/lib/elevenlabs";

/**
 * Real ElevenLabs Service
 */
export async function synthesizeSpeech(text: string, voiceId?: string): Promise<string> {
  try {
    const selectedVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID;
    
    if (!selectedVoiceId) {
      // Fallback to first available voice if none configured
      const voices = await elevenlabs.voices.getAll();
      if (!voices.voices[0]) throw new Error("No voices found in account");
      voiceId = voices.voices[0].voice_id;
    } else {
      voiceId = selectedVoiceId;
    }

    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text,
      model_id: "eleven_multilingual_v2",
    });

    // Convert Stream to Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Convert Buffer to Base64 Data URL for easy frontend playback
    return `data:audio/mpeg;base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("ElevenLabs Synthesis Error:", error);
    throw new Error("Failed to synthesize speech");
  }
}
