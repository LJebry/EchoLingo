import { NextResponse } from "next/server"
import openai from "@/lib/openai"
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
    const sourceHint = sourceLanguage ?? "auto-detect"

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator. Preserve tone, intent, and formatting. Return only the translated text.",
        },
        {
          role: "user",
          content: `Translate the following text from ${sourceHint} to ${targetLanguage}:\n\n${text}`,
        },
      ],
    })

    const translatedText = completion.choices[0]?.message?.content?.trim()
    if (!translatedText) {
      return NextResponse.json({ error: "No translation returned" }, { status: 502 })
    }

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error("Translate API error:", error)
    return NextResponse.json({ error: "API Failure" }, { status: 500 })
  }
}
