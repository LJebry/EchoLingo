# EchoLingo - The Digital Polyglot

EchoLingo is a mobile-first PWA for live translation and voice cloning. It allows users to speak in one language and get an immediate translation in another, optionally synthesized with a cloned version of their own voice.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (following [DESIGN.MD](./DESIGN.MD))
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** Auth.js (NextAuth v5) with Google Provider
- **PWA:** Service Workers and Manifest for "Add to Home Screen"
- **AI Integrations:** OpenAI (Whisper/GPT-4) & ElevenLabs (Voice Cloning) - *Mocked in MVP*

## Features

- **Guest Mode:** Try the translator immediately on the landing page.
- **Persistence:** Logged-in users can save their conversation history.
- **Voice Profiles:** Manage multiple speaker profiles for different language pairs.
- **PWA Ready:** Installable on iOS and Android.
- **Mobile-First UI:** Designed for handheld use with high-touch targets and atmospheric depth.

## Getting Started

### 1. Setup Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

For Google sign-in, create an OAuth client in Google Cloud Console and add these redirect settings:

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

Set `AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your local or deployed app URL as well.

For deployment, add the deployed app URL and matching callback URL too.

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Set `DATABASE_URL` to either:

- a Prisma Accelerate or Prisma Postgres URL such as `prisma+postgres://...`
- a direct PostgreSQL connection string such as `postgresql://...`

```bash
# Generate Prisma Client
npx prisma generate

# Run Migrations
npx prisma migrate dev --name init

# Seed Database
npm run seed
```

Add the seed script to your `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your mobile device or browser.

### 5. Verify Authentication

- Visit `/login`
- Click `Continue with Google`
- Confirm you are redirected to `/dashboard`
- Visit `/settings` and use `Sign Out` to end the session

## AI Integration Roadmap

The AI pipeline is centralized in `src/lib/services/process-turn.ts`. To go live:

1. **Transcription:** Replace mock in `openai.ts` with `openai.audio.transcriptions.create`.
2. **Translation:** Replace mock in `openai.ts` with a GPT-4 prompt for precise translation.
3. **Speech Synthesis:** Replace mock in `elevenlabs.ts` with the ElevenLabs SDK `generate` method using the `elevenLabsVoiceId`.

## PWA Installation

- **iOS:** Tap "Share" -> "Add to Home Screen".
- **Android:** Tap "Add to Home Screen" or the install banner.

---

Built for the future of global communication.
