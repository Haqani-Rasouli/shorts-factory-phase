# Shorts Factory — Phase 1

A local-first Chrome Manifest V3 extension for producing YouTube Shorts concepts:
Topic → Idea scoring → 5 hooks → ranked hook → script → scene breakdown → generation prompts.

This Phase 1 intentionally uses a deterministic mock AI engine so it works without API keys.
The architecture is designed so a secure backend can replace the mock engine in Phase 2.

## Current features
- Chrome Side Panel UI
- Project creation and local persistence
- Idea scoring
- 5 hook variants + ranking
- Shorts script generation
- Scene-by-scene storyboard
- Video-generation prompts
- Regeneration of hooks/script/scenes
- Project history
- Export project JSON
- No API keys stored in the extension

## Load in Chrome
1. Open `chrome://extensions`
2. Enable Developer mode.
3. Click Load unpacked.
4. Select the `extension` folder.
5. Click the extension icon and open the side panel.

Chrome Manifest V3 requires the extension code to be bundled; the service worker is used only for extension lifecycle/message handling.

## Phase 1 architecture

Chrome Side Panel
  ↓
service-worker.js
  ↓
engine.js (temporary mock)
  ↓
chrome.storage.local

Phase 2:
Side Panel
  ↓
service-worker
  ↓
secure backend API
  ↓
Claude / research / media providers

Do NOT put Claude, Google, vidIQ, YouTube, or other secret API keys in the extension.

## Next build phase
Replace `engine.js` mock generation with a backend orchestrator:
- Claude for research/script/scene planning
- provider abstraction for video generation
- TTS provider
- FFmpeg rendering service
- job queue
- asset storage
- cost tracking

See `docs/ROADMAP.md`.
