import openai from "@/lib/openai";

/**
 * Real OpenAI Service for Transcription and Translation
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // Convert Blob to File for OpenAI API
    const file = new File([audioBlob], "audio.webm", { type: audioBlob.type });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error("OpenAI Transcription Error:", error);
    throw new Error("Failed to transcribe audio");
  }
}

export async function cleanTranscript(text: string): Promise<string> {
  // Whisper is usually pretty clean, but we can do a simple trim
  return text.trim();
}

export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional translator. Preserve tone and intent. Return ONLY the translated text."
        },
        {
          role: "user",
          content: `Translate from ${sourceLang} to ${targetLang}: ${text}`
        }
      ],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content?.trim() || "Translation failed";
  } catch (error) {
    console.error("OpenAI Translation Error:", error);
    throw new Error("Failed to translate text");
  }
}
