import { NextResponse } from "next/server"
import { translateText } from "@/lib/services/openai"
import { z } from "zod"

const translateSchema = z.object({
  text: z.string().trim().min(1),
  sourceLanguage: z.string().trim().min(1).optional(),
  targetLanguage: z.string().trim().min(1),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = translateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { text, sourceLanguage, targetLanguage } = parsed.data
    const translatedText = await translateText({
      text,
      sourceLanguage,
      targetLanguage,
    })

    return NextResponse.json({ translatedText })
  } catch (error: any) {
    console.error("Translate API error:", error)

    if (error instanceof Error && error.message === "OpenAI API key is missing or invalid") {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (error?.status === 401) {
      return NextResponse.json({ error: "Invalid OpenAI API Key" }, { status: 401 })
    }
    if (error?.status === 429) {
      return NextResponse.json({ error: "OpenAI Rate Limit Exceeded" }, { status: 429 })
    }
    if (error instanceof Error && error.message === "No translation returned from OpenAI") {
      return NextResponse.json({ error: error.message }, { status: 502 })
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation API Failure" },
      { status: 500 }
    )
  }
}
