---
name: argentina-tv-manager
description: Manage the Argentina TV platform, including channel cataloging, stream validation, and deployment tasks. Use when adding new channels, updating province metadata, or performing maintenance on the TV app's backend.
---

# Argentina TV Manager

This skill helps you maintain the catalog of free-to-air channels for Argentina and manage the project's infrastructure.

## Workflows

### 1. Add/Update a Channel
When adding a new channel:
1. Validate the stream URL using `scripts/validate_stream.cjs`.
2. Ensure it follows the schema in `references/schema.md`.
3. Update the Firestore database (using appropriate tools or scripts).

### 2. Validate All Channels
To check the health of the catalog:
1. Read the list of channels from Firestore.
2. Run `scripts/validate_stream.cjs` for each URL.
3. Report any dead links.

### 3. Database Schema
Always refer to `references/schema.md` before making structural changes to Firestore or the data models in the app.

## Tools
- **Validate Stream:** `node scripts/validate_stream.cjs <url>`
- **Schema Reference:** See `references/schema.md`
