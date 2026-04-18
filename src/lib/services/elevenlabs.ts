import { elevenlabs } from "@/lib/elevenlabs"
import { Readable } from "node:stream"

const DEFAULT_TTS_MODEL = "eleven_multilingual_v2"
const DEFAULT_FALLBACK_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"

function getRawElevenLabsMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "body" in error &&
    error.body &&
    typeof error.body === "object" &&
    "detail" in error.body &&
    error.body.detail &&
    typeof error.body.detail === "object" &&
    "message" in error.body.detail &&
    typeof error.body.detail.message === "string"
  ) {
    return error.body.detail.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return null
}

function getElevenLabsErrorMessage(error: unknown) {
  const rawMessage = getRawElevenLabsMessage(error)

  if (!process.env.ELEVENLABS_API_KEY) {
    return "ElevenLabs API key is not configured."
  }

  if (rawMessage?.includes("voices_read")) {
    return "Voice lookup requires the ElevenLabs voices_read permission. Set ELEVENLABS_VOICE_ID in .env to skip voice discovery."
  }

  if (rawMessage) {
    return rawMessage
  }

  return "Speech synthesis failed."
}

function getConfiguredVoiceId(preferredVoiceId?: string) {
  return (
    preferredVoiceId?.trim() ||
    process.env.ELEVENLABS_VOICE_ID?.trim() ||
    DEFAULT_FALLBACK_VOICE_ID
  )
}

async function streamToBuffer(stream: Readable | ReadableStream<Uint8Array>) {
  const readable = stream instanceof Readable ? stream : Readable.fromWeb(stream as any)
  const chunks: Buffer[] = []

  for await (const chunk of readable) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}

async function resolveVoiceId(preferredVoiceId?: string) {
  const configuredVoiceId = getConfiguredVoiceId(preferredVoiceId)
  if (configuredVoiceId) {
    return configuredVoiceId
  }

  try {
    const voices = await elevenlabs.voices.getAll()
    const firstVoice = voices.voices[0] as
      | {
          voiceId?: string
          voice_id?: string
        }
      | undefined
    const firstVoiceId = firstVoice?.voiceId || firstVoice?.voice_id

    if (!firstVoiceId) {
      throw new Error("No ElevenLabs voice found. Set ELEVENLABS_VOICE_ID in .env to choose a voice explicitly.")
    }

    return firstVoiceId
  } catch (error) {
    throw new Error(getElevenLabsErrorMessage(error))
  }
}

export const synthesizeSpeechToBuffer = async (text: string, voiceId?: string): Promise<Buffer> => {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ElevenLabs API key is not configured.")
  }

  try {
    const resolvedVoiceId = await resolveVoiceId(voiceId)
    const audioStream = await elevenlabs.textToSpeech.convert(resolvedVoiceId, {
      text,
      modelId: DEFAULT_TTS_MODEL,
    })

    return streamToBuffer(audioStream)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }

    throw new Error(getElevenLabsErrorMessage(error))
  }
}

export const synthesizeSpeech = async (text: string, voiceId?: string): Promise<string> => {
  const buffer = await synthesizeSpeechToBuffer(text, voiceId)
  return `data:audio/mpeg;base64,${buffer.toString("base64")}`
}

/**
 * Instant Voice Cloning using Direct REST API
 */
export const cloneVoice = async (audioBlob: Blob, name: string): Promise<string> => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ElevenLabs API key is not configured.");
  }

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", "Custom voice profile created for EchoLingo.");
    
    // Convert Blob to File for the multipart request
    const file = new File([audioBlob], "sample.webm", { type: "audio/webm" });
    formData.append("files", file);

    const response = await fetch("https://api.elevenlabs.io/v1/voices/add", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("ElevenLabs API Error:", data);
      throw new Error(data.detail?.message || "Failed to clone voice via ElevenLabs API");
    }

    return data.voice_id;
  } catch (error) {
    console.error("ElevenLabs Cloning Error:", error);
    throw error;
  }
}

/**
 * Delete a custom voice
 */
export const deleteVoice = async (voiceId: string): Promise<void> => {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("ElevenLabs API key is not configured.")
  }

  try {
    await elevenlabs.voices.delete(voiceId)
  } catch (error) {
    console.error("ElevenLabs Voice Deletion Error:", error)
  }
}
