# EchoLingo

EchoLingo is a mobile-first translation app built for live demos. It supports guest translation, two-speaker conversation mode, Google sign-in, saved history, and optional custom voice playback powered by ElevenLabs.

## Start Here: Hackathon Judge Guide

### Mode 1: Guest Quick Translate (`/`)

This is the fastest happy-path demo and does not require login.

What to do:

1. Open `https://echo-lingo-eight.vercel.app/`.
2. Pick a source language and a target language.
3. Type a phrase in the left panel.
4. Press the send button to translate it.
5. Optionally play the original text or translated text with the audio buttons.

What happens under the hood:

1. The home page calls `POST /api/translate`.
2. `src/lib/services/openai.ts` sends the text to OpenAI `gpt-4o-mini`.
3. Audio playback uses `POST /api/synthesize`.
4. `src/lib/services/elevenlabs.ts` converts text to speech with ElevenLabs `eleven_multilingual_v2`.

Important behavior:

- The home page is text-first. It does not record microphone audio.
- Guests can use the default AI voice.
- Signed-in users can also select saved voice profiles for playback when a profile includes an ElevenLabs voice ID.

### Mode 2: Live Conversation (`/conversations`)

This is the real-time two-speaker mode. It works in guest mode and signed-in mode.

What to do:

1. Open `/conversations`.
2. Set each speaker's language.
3. Use either speaker mic to record a turn, or type a turn into the shared input area.
4. Let the app return the translated reply and play translated audio.

What happens under the hood:

1. The UI first tries to create a saved conversation through `POST /api/conversations`.
2. If that request returns `401`, the page automatically falls back to guest mode.
3. Each turn is sent to `POST /api/process-turn`.
4. Audio turns are transcribed with OpenAI `whisper-1`.
5. The transcript is trimmed, translated with OpenAI `gpt-4o-mini`, and then sent to ElevenLabs for speech synthesis.
6. If audio synthesis fails, the translated text still returns and the conversation continues.

Important behavior:

- Both speakers can use mic input or typed input.
- The translated audio auto-plays when synthesis succeeds.
- Logged-in users get persistent history.
- Guests still get the full live translation flow, just without saved conversations.

### Mode 3: Signed-In Voice And History Mode (`/login`, `/dashboard`, `/voices`, `/history`)

Google sign-in unlocks persistence and custom voice management.

What to do:

1. Open `/login` and sign in with Google.
2. Use `/dashboard` for a quick overview.
3. Open `/history` to review saved conversations.
4. Open `/voices/new` to create a voice profile from a recorded sample.
5. Use that profile on `/` or `/conversations` when it has an `elevenLabsVoiceId`.

What happens under the hood:

1. Auth is handled with Auth.js / NextAuth v5 and the Prisma adapter.
2. Voice profile creation posts recorded audio to `POST /api/speaker-profiles`.
3. The server calls ElevenLabs Instant Voice Cloning and stores the returned `elevenLabsVoiceId`.
4. Deleting a profile also attempts to delete the linked ElevenLabs voice.

Recommended judge flow:

1. Start on `/` for a fast guest translation demo.
2. Move to `/conversations` for the live dual-speaker experience.
3. Sign in to show persistence on `/history`.
4. If time allows, show `/voices/new` to demonstrate custom voice setup.

## What Works Today

- Typed translation on `/`
- Text-to-speech playback for source and translated text on `/`
- Dual-speaker conversation flow on `/conversations`
- Microphone capture with `MediaRecorder`
- Typed fallback input inside conversation mode
- OpenAI transcription for conversation audio turns
- OpenAI translation for both quick translate and conversation flows
- ElevenLabs speech synthesis for playback
- Google sign-in
- Saved conversations and history for authenticated users
- Speaker profile creation and deletion for authenticated users

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Prisma 7
- PostgreSQL
- Auth.js / NextAuth v5 beta
- OpenAI API
- ElevenLabs API
- Zod

## Core Routes

| Route | Purpose | Auth |
| --- | --- | --- |
| `/` | Quick typed translation and playback | Optional |
| `/conversations` | Main dual-speaker live conversation experience | Optional |
| `/history` | Saved conversations list | Required |
| `/conversations/[id]` | Saved conversation detail | Required |
| `/dashboard` | Signed-in overview | Required |
| `/voices` | Speaker profile management | Required |
| `/voices/new` | Voice profile creation | Required |
| `/login` | Google sign-in screen | Guest |

## Core API Endpoints

| Endpoint | Purpose | Notes |
| --- | --- | --- |
| `POST /api/translate` | Quick text translation | Uses OpenAI `gpt-4o-mini` |
| `POST /api/synthesize` | Text-to-speech playback | Uses ElevenLabs `eleven_multilingual_v2` |
| `POST /api/process-turn` | Conversation turn pipeline | Handles audio or typed turns, plus optional persistence |
| `GET /api/conversations` | List saved conversations | Auth required |
| `POST /api/conversations` | Create a conversation shell | Auth required |
| `GET /api/conversations/[id]` | Load one saved conversation with turns | Auth required |
| `GET /api/speaker-profiles` | List voice profiles | Auth required |
| `POST /api/speaker-profiles` | Create a voice profile | Auth required |
| `DELETE /api/speaker-profiles/[id]` | Delete a voice profile | Auth required |
| `POST /api/transcribe` | Placeholder route | Present in repo but not used by the main UI |

## Data Model

The Prisma schema centers on four product entities:

- `User`: authenticated account record used by Auth.js
- `Conversation`: a saved conversation container owned by a user
- `ConversationTurn`: each translated turn inside a saved conversation
- `SpeakerProfile`: a saved voice profile, optionally linked to an ElevenLabs voice ID

## Local Setup

### Prerequisites

- Node.js `20.20.2` from `.nvmrc`
- PostgreSQL
- An OpenAI API key
- An ElevenLabs API key
- Google OAuth credentials if you want to test login and saved features

### 1. Install dependencies

```bash
nvm use
npm install
```

### 2. Create `.env`

This repo does not currently include a committed `.env.example`, so create `.env` manually:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
OPENAI_API_KEY="your_openai_key"
ELEVENLABS_API_KEY="your_elevenlabs_key"

AUTH_SECRET="your_auth_secret"
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"

AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

ELEVENLABS_VOICE_ID=""
```

Environment notes:

- `DATABASE_URL`, `OPENAI_API_KEY`, and `ELEVENLABS_API_KEY` are required for the core translation demo.
- `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET` are required for Google sign-in, dashboard, history, and voice profile features.
- `ELEVENLABS_VOICE_ID` is optional. If it is not set, the app falls back to a hard-coded default ElevenLabs voice ID.
- `AUTH_URL` and `NEXT_PUBLIC_APP_URL` are useful local and deployment settings. The current app source does not read `NEXT_PUBLIC_APP_URL` directly.

### 3. Sync Prisma and start the app

Use `db push` here because the repo currently does not include committed Prisma migration files.

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000`.

## Google OAuth Setup

Create a Google OAuth client and add:

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

If you deploy the app, add the production app URL and callback URL too.

If Google shows `Error 403: org_internal`, switch the consent screen to external or add your account as a test user.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Verification

These checks were validated against the current repo state:

- `npm run build` passes
- `npm run lint` passes with non-blocking Next.js warnings
- `npx tsc --noEmit` passes after a build has generated `.next/types`

Current lint warnings:

- `src/app/layout.tsx`: custom Google font stylesheet warning
- `src/components/layout/UserProfile.tsx`: `<img>` warning from Next.js lint rules

## Known Notes

- The main conversation experience is `/conversations`.
- `/conversations/new` is an older alternate screen still present in the repo, but it is not the primary demo route.
- `POST /api/transcribe` exists as a placeholder and is not part of the primary user flow.
- PWA assets such as `public/manifest.json` and `public/sw.js` exist, but the registration component is not mounted in `src/app/layout.tsx`, so PWA behavior should be treated as incomplete.

## Project Structure

```text
src/app/
  page.tsx                         quick translate UI
  conversations/page.tsx          main conversation UI
  voices/page.tsx                 voice profile manager
  history/page.tsx                saved conversation history
  api/                            app router API endpoints

src/components/
  AudioRecorder.tsx               microphone capture
  conversation/ConversationPage.tsx

src/lib/
  auth.ts                         Auth.js config
  prisma.ts                       Prisma client bootstrap
  services/openai.ts              translation + transcription
  services/elevenlabs.ts          TTS + voice cloning
  services/process-turn.ts        conversation pipeline
```
