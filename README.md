# EchoLingo

EchoLingo is a mobile-first translation app built with Next.js. It supports fast typed translation on the home page, dual-speaker conversation mode, saved history for signed-in users, and optional speech playback through ElevenLabs.

## What Works

- Typed translation on `/` through `POST /api/translate`
- Conversation turns on `/conversations` through `POST /api/process-turn`
- OpenAI transcription for audio conversation turns
- OpenAI translation for both typed and conversation flows
- ElevenLabs speech synthesis for translated playback when a usable voice is configured
- Google sign-in, saved conversations, history, and speaker profiles

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Auth.js / NextAuth v5 beta
- OpenAI for transcription and translation
- ElevenLabs for speech synthesis

## Environment Variables

Copy `.env.example` to `.env` and fill in the values you need:

```bash
cp .env.example .env
```

Required for local app startup:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `AUTH_TRUST_HOST`
- `NEXT_PUBLIC_APP_URL`

Required for Google sign-in:

- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

Required for AI features:

- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`

Recommended for reliable ElevenLabs playback:

- `ELEVENLABS_VOICE_ID`

`ELEVENLABS_VOICE_ID` is optional in code, but strongly recommended in practice. If it is missing, EchoLingo tries to look up the first available ElevenLabs voice with `voices.getAll()`. That fallback requires an API key with the `voices_read` permission. If your key does not have that permission, typed and conversation translation still work, but audio playback will be unavailable until you either:

- set `ELEVENLABS_VOICE_ID` explicitly
- or create an ElevenLabs API key that includes `voices_read`

## Google OAuth Setup

Create a Google OAuth client and add:

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

If you deploy the app, add the production app URL and callback URL too.

If Google shows `Error 403: org_internal`, switch the consent screen to external or add your account as a test user.

## Install And Run

Install dependencies:

```bash
npm install
```

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Translation Pipeline

Home page typed translation:

- UI: `src/app/page.tsx`
- Route: `src/app/api/translate/route.ts`
- Shared OpenAI helper: `src/lib/services/openai.ts`

Conversation mode:

- UI: `src/components/conversation/ConversationPage.tsx`
- Route: `src/app/api/process-turn/route.ts`
- Turn pipeline: `src/lib/services/process-turn.ts`
- ElevenLabs helper: `src/lib/services/elevenlabs.ts`

Current behavior:

1. Audio turns are transcribed with OpenAI `whisper-1`.
2. Text is translated with OpenAI `gpt-4o-mini`.
3. EchoLingo attempts translated speech playback through ElevenLabs.
4. If ElevenLabs playback fails, the translated text still returns and the conversation continues without audio.

## Troubleshooting

`OpenAI API key is missing or invalid`

- Check that `OPENAI_API_KEY` is present in `.env`
- Restart the Next.js dev server after editing env vars

`Set ELEVENLABS_VOICE_ID in .env or use an ElevenLabs API key with the voices_read permission.`

- Add `ELEVENLABS_VOICE_ID` to `.env`
- or create an ElevenLabs API key with `voices_read`

Conversation turn succeeds but no audio plays

- Translation completed successfully
- Check the warning shown in the conversation UI
- Verify `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID`

Build warnings about the Material Symbols stylesheet

- These come from `src/app/layout.tsx`
- They do not currently block `npm run build`

## Verification

Useful local checks:

```bash
npx tsc --noEmit
npm run build
```
