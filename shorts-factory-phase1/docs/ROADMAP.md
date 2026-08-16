# Shorts Factory Roadmap

## Phase 1 — DONE
Local-first production planner:
- Ideas
- scoring
- hooks
- script
- scenes
- prompts
- persistence
- regeneration
- export

## Phase 2 — AI backend
Build a Node.js backend with:
- `/api/projects`
- `/api/generate/ideas`
- `/api/generate/hooks`
- `/api/generate/script`
- `/api/generate/storyboard`
- provider interfaces
- authentication
- rate limiting
- encrypted server-side secrets

Claude should generate structured JSON, not uncontrolled prose.

## Phase 3 — Research
Integrate official/authorized research providers.
Inputs:
- keyword demand
- trends
- competition
- related questions
- outlier videos
- competitor patterns

Score ideas using explainable heuristics. Never promise virality.

## Phase 4 — Media
Provider interfaces:
- VideoProvider
- VoiceProvider
- ImageProvider
- MusicProvider

Google's Gemini API currently documents programmatic Veo 3.1 video generation, including portrait 9:16 output, reference images and video extension. Treat Flow UI automation separately from official APIs.

## Phase 5 — Rendering
Server-side FFmpeg pipeline:
- 1080x1920
- scene concatenation
- voice synchronization
- animated subtitles
- music ducking
- SFX
- transitions
- final MP4

## Phase 6 — YouTube
OAuth + YouTube API:
- upload as private/unlisted first
- title
- description
- tags/hashtags
- thumbnail/cover frame
- scheduling only after user approval

## Phase 7 — Channel intelligence
Once enough real uploads exist:
- views
- viewed vs swiped away
- average view duration
- average percentage viewed
- likes
- comments
- shares
- subscribers gained

Feed channel-specific evidence back into idea and hook ranking.

## 20-minute human workflow
The target is <=20 minutes of HUMAN involvement:
1. Pick idea: 2–3 min
2. Review hooks/script: 3–4 min
3. AI generates assets in background
4. Review final: 3–5 min
5. Regenerate/edit/approve: 5–8 min

AI generation time may exceed 20 minutes; the human interaction target should not.
