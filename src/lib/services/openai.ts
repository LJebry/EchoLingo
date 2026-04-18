import openai from "@/lib/openai"

const PLACEHOLDER_OPENAI_KEY_PREFIX = "sk-abcdef"
const TRANSLATION_MODEL = "gpt-4o-mini"
const TRANSCRIPTION_MODEL = "whisper-1"

function ensureOpenAiApiKey() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey || apiKey.startsWith(PLACEHOLDER_OPENAI_KEY_PREFIX)) {
    throw new Error("OpenAI API key is missing or invalid")
  }
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  ensureOpenAiApiKey()

  try {
    const file = new File([audioBlob], "audio.webm", { type: audioBlob.type || "audio/webm" })

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: TRANSCRIPTION_MODEL,
    })

    return transcription.text.trim()
  } catch (error) {
    console.error("OpenAI Transcription Error:", error)
    throw error
  }
}

export async function cleanTranscript(text: string): Promise<string> {
  return text.trim()
}

export async function translateText({
  text,
  sourceLanguage,
  targetLanguage,
}: {
  text: string
  sourceLanguage?: string
  targetLanguage: string
}): Promise<string> {
  ensureOpenAiApiKey()

  try {
    const response = await openai.chat.completions.create({
      model: TRANSLATION_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator. Preserve tone, meaning, names, and formatting. Return only the translated text.",
        },
        {
          role: "user",
          content: [
            `Source language: ${sourceLanguage?.trim() || "auto-detect"}`,
            `Target language: ${targetLanguage.trim()}`,
            "Text:",
            text,
          ].join("\n"),
        },
      ],
    })

    const translatedText = response.choices[0]?.message?.content?.trim()

    if (!translatedText) {
      throw new Error("No translation returned from OpenAI")
    }

    return translatedText
  } catch (error) {
    console.error("OpenAI Translation Error:", error)
    throw error
  }
}
