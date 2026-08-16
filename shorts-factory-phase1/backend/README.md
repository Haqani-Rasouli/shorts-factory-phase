# Backend placeholder

This folder is intentionally not wired into Phase 1.

When Phase 2 begins, use a server-side Node.js service.

Suggested structure:

src/
  server.ts
  routes/
  orchestrator/
  providers/
    llm/
    research/
    video/
    voice/
    music/
  render/
  jobs/
  storage/
  security/

Secrets must remain server-side.

The extension should call the backend with short-lived authenticated requests.
