/**
 * Mocked OpenAI Service
 * Replace with real implementation later using 'openai' package
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  console.log("Mocking transcription for audio blob...")
  return "This is a mocked transcript of the spoken audio."
}

export async function cleanTranscript(text: string): Promise<string> {
  console.log("Mocking transcript cleaning...")
  return text.trim()
}

export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  console.log(`Mocking translation from ${sourceLang} to ${targetLang}...`)
  return `[Mocked Translation to ${targetLang}]: ${text}`
}
