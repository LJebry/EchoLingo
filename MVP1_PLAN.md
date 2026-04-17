# MVP1 Plan

## What we are trying to ship in 48 hours

Our goal for MVP1 is not to build the full EchoLingo vision. Our goal is to get a working, demo-safe prototype live as fast as possible.

For this hackathon, MVP1 is:

- A user opens EchoLingo on mobile or desktop.
- They can pick a source language and a target language.
- They can speak a short phrase, or type one if the microphone is being annoying.
- The app returns translated text.
- The app can play back the translated audio.
- If the user is signed in, the session can be saved and viewed again later.

If we achieve that reliably, we have a real prototype.

## Product decisions for the hackathon

These are the decisions we should commit to now so we do not burn time debating them later:

- We optimize for a reliable translation demo, not full voice cloning.
- We keep guest mode as a first-class path so the demo never depends on login.
- We add typed input as a backup path because microphone permissions can fail at the worst possible time.
- We keep the core flow to one strong happy path instead of spreading effort across too many pages.
- We deploy early, even if the first deployment is ugly, because a public demo URL is part of the prototype.
- True voice cloning is a stretch goal. For MVP1, using a default synthesized voice or a manually configured voice ID is good enough.

## What the current setup already gives us

The repo is already pointing in the right direction:

- Prisma models exist for users, conversations, turns, and speaker profiles.
- Auth scaffolding exists.
- Conversation and speaker profile API routes already exist.
- `process-turn` already exists as the central pipeline.
- The dashboard, conversations list, and conversation detail pages are started.

The main gaps are also clear:

- The home page is still basically empty.
- `TranslatorCard` is mocked.
- `AudioRecorder`, `TranslationBox`, and `AudioPlayer` are placeholders.
- The OpenAI and ElevenLabs service layers are mocked.
- `/voices/new` is linked in the UI but the route does not exist yet.
- The global styling is still very bare, so the app will not feel cohesive yet.

That means our shortest path is not starting from scratch. It is wiring the existing skeleton into one real flow.

## Recommended issue order

The safest way to move fast is to create these issues in this exact order and let the team work in parallel once Issue 1 is moving.

### Issue 1: Lock the MVP scope and assign lanes

**Why this is first**

If we do not freeze scope now, we will lose hours to re-deciding the same things.

**What we do**

- Agree that MVP1 is speech or typed input to translated text to audio playback.
- Agree that guest mode is required.
- Agree that true voice cloning is not required for MVP1.
- Assign one person to frontend flow, one person to API and AI wiring, and one person to auth, DB, and deployment.

**Acceptance criteria**

- Everyone on the team can say the MVP in one sentence.
- We have owners for each issue.
- Stretch goals are explicitly separated from required work.

**Suggested estimate**

- 30 minutes

### Issue 2: Build the real home screen and guest translation flow

**Why this matters**

Right now the landing page is only a placeholder. This is the highest-value screen in the product.

**What we do**

- Replace the current home page with the translator experience.
- Use the existing visual language from the dashboard so the app feels like one product.
- Add source language and target language selectors.
- Add a clear mic action and a typed input fallback.
- Show transcript, translation, loading state, and error state.
- Wire the UI to `POST /api/process-turn`.

**Acceptance criteria**

- A guest user can open `/` and complete one full translation flow without logging in.
- The screen works on a phone-sized viewport.
- Errors are understandable and do not dead-end the user.

**Suggested estimate**

- 5 to 7 hours

**Depends on**

- Issue 1

### Issue 3: Make the turn-processing pipeline reliable in mock mode first, real AI second

**Why this matters**

We need a demo that works even if external APIs misbehave. Reliability beats ambition for a hackathon.

**What we do**

- Keep `process-turn` as the single source of truth for the pipeline.
- Support both mock mode and real mode through environment flags.
- Make sure the response shape is stable whether we use mocks or real services.
- Support manual text input in the same pipeline so the UI only has one backend contract to care about.
- Add simple logging around each step so debugging is easy during the hackathon.

**Acceptance criteria**

- The full flow works end to end in mock mode.
- Real AI mode can be turned on with env vars when ready.
- If a provider fails, the app returns a useful error instead of silently breaking.

**Suggested estimate**

- 4 to 6 hours

**Depends on**

- Issue 1

### Issue 4: Implement microphone capture and translated audio playback

**Why this matters**

The product promise feels real when someone can speak and hear the result. Without this, it feels like a translation form.

**What we do**

- Implement `AudioRecorder` with `MediaRecorder`.
- Handle microphone permission errors gracefully.
- Allow stop, retry, and re-record.
- Implement audio playback for the translated response.
- Keep typed input available as fallback if recording fails.

**Acceptance criteria**

- Recording works in a modern browser on a phone and on desktop Chrome.
- A translated audio response can be played back from the UI.
- If recording is blocked, the typed input flow still works.

**Suggested estimate**

- 4 to 6 hours

**Depends on**

- Issue 2
- Issue 3

### Issue 5: Save conversations for signed-in users

**Why this matters**

Once the guest flow works, persistence makes the prototype feel like a real product instead of a one-off demo.

**What we do**

- Create or reuse a conversation when a signed-in user starts translating.
- Save turns through the existing Prisma models.
- Make sure the history page and conversation detail page reflect real saved data.
- Keep guest users unblocked even if they are not signed in.

**Acceptance criteria**

- A signed-in user can complete a translation and see it in history.
- Clicking into a saved conversation shows the full turn list.
- Guest mode still works without trying to force login.

**Suggested estimate**

- 3 to 5 hours

**Depends on**

- Issue 2
- Issue 3

### Issue 6: Finish the simplest useful version of speaker profiles

**Why this matters**

Speaker profiles are part of the product story, but they can also eat a lot of time if we overbuild them.

**What we do**

- Add the missing create flow for speaker profiles.
- Keep the form minimal: display name, source language, target language, optional ElevenLabs voice ID.
- Let the translation flow optionally attach a profile.
- Do not build full voice-clone enrollment unless everything else is already working.

**Acceptance criteria**

- A signed-in user can create a profile.
- The profile can be selected or associated with a conversation flow.
- The page has no dead links, especially around `/voices/new`.

**Suggested estimate**

- 3 to 4 hours

**Depends on**

- Issue 5

### Issue 7: Auth, database setup, and clean-machine setup pass

**Why this matters**

Hackathon projects often “work on one laptop.” We want this to work for the team and on deployment.

**What we do**

- Verify Google Auth actually works end to end.
- Verify Prisma setup and migrations are clean.
- Add or clean up environment variable docs.
- Make sure one teammate can clone, install, migrate, and run the app quickly.
- If Google Auth becomes a time sink, keep guest mode as the fallback demo path and do not let auth block the core prototype.

**Acceptance criteria**

- One clean setup pass works in under 20 minutes.
- The app can run locally with clear setup steps.
- Auth is either working or explicitly marked as non-blocking for demo day.

**Suggested estimate**

- 2 to 4 hours

**Depends on**

- Can run in parallel with Issues 2 through 6

### Issue 8: UI polish, mobile sanity pass, and dead-link cleanup

**Why this matters**

A prototype does not need to be perfect, but it should feel intentional and not fall apart in a live demo.

**What we do**

- Make the home page, dashboard, and conversation screens visually consistent.
- Fix the current white background and basic global styling.
- Add loading, empty, and error states where the user might otherwise get confused.
- Remove or hide unfinished routes instead of linking to dead ends.
- Do a quick mobile pass for spacing, sticky actions, and tap targets.

**Acceptance criteria**

- No obvious dead links.
- The app looks coherent on mobile.
- The main demo path feels polished enough to present confidently.

**Suggested estimate**

- 3 to 5 hours

**Depends on**

- Issue 2
- Issue 4

### Issue 9: Deploy, smoke test, and write the demo script

**Why this matters**

A prototype is not done when the code works locally. It is done when the team can confidently show it.

**What we do**

- Deploy a working version as early as possible.
- Test the public URL on real phones.
- Prepare one short demo script with a backup path.
- Seed at least one demo-ready account or conversation if needed.
- Decide exactly what we will say if real AI is flaky and we need to switch to mock mode.

**Acceptance criteria**

- We have a public URL.
- The team has a 60 to 90 second demo flow.
- We have a backup demo path that still works if auth or live AI has issues.

**Suggested estimate**

- 2 to 3 hours

**Depends on**

- Issue 2
- Issue 3
- Issue 4

## Suggested team split

If we have three people, this is the most efficient split:

- Person 1: Home screen, translator UI, recorder, playback, mobile polish
- Person 2: `process-turn`, OpenAI and ElevenLabs integration, mock mode, error handling
- Person 3: Auth, Prisma, conversations, speaker profiles, deployment, setup docs

If we only have two people:

- Person 1 owns the end-user flow from home page to translation result
- Person 2 owns backend wiring, data persistence, auth, and deployment

## 48-hour execution plan

### First 6 hours

- Finish Issue 1 immediately.
- Start Issue 2 and Issue 3 in parallel.
- Get one translation result rendering on the home screen, even if it is still mocked.

### Hours 6 to 18

- Finish Issue 4 so speaking and playback work.
- Start Issue 5 once the translation pipeline is stable.
- Run the first deploy before the UI is perfect.

### Hours 18 to 30

- Finish persistence and history.
- Do the clean-machine and env setup pass.
- Add the simplest useful speaker profile flow if the core demo is stable.

### Hours 30 to 42

- Polish the main path.
- Remove dead ends.
- Test on real devices.

### Final 6 hours

- Lock the demo script.
- Fix only high-confidence bugs.
- Do not start any new big feature.

## What we should explicitly not do in MVP1

These are tempting, but they are likely to hurt us in a 48-hour sprint:

- Full custom voice-cloning enrollment flow
- Real-time streaming translations
- Complex settings pages
- Advanced conversation management
- Fancy onboarding
- Large language support matrix before one language pair feels solid

## Definition of done for MVP1

We are done when:

- A guest user can translate a short phrase from the home page.
- The app shows translated text and can play audio back.
- A signed-in user can save and revisit a conversation, if auth is working.
- The deployed version works on a phone.
- The team can demo it smoothly without explaining away broken basics.

## Final recommendation

The right call for this hackathon is to treat EchoLingo as a **translation-first prototype with optional voice personality**, not as a full voice-cloning platform yet.

That decision gives us the best chance of shipping something real, believable, and demo-ready within 48 hours.
