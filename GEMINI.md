# Argentina TV - Engineering Standards

## Project Overview
This project is a hybrid Web and Android TV application for streaming Argentina's FTA channels. It uses Next.js for the frontend and Firebase for the backend.

## Architectural Patterns
- **Clean Architecture:** Keep business logic (services/hooks) separate from UI components.
- **D-Pad Navigation:** All interactive elements must be focusable and navigable via keyboard/remote arrows. Use `react-spatial-navigation` or custom `onKeyDown` handlers.
- **Firebase Integration:** Centralize Firebase logic in `src/services/firebase`. Use custom hooks for reactive state (e.g., `useAuth`, `useChannels`).

## Development Workflow
- **Naming:** Use PascalCase for components and camelCase for hooks and utilities.
- **Styling:** Use Tailwind CSS. Avoid inline styles unless necessary for dynamic values.
- **Testing:** Add unit tests for business logic in `src/services` and `src/hooks`.
- **TV Optimization:** Ensure all clickable elements have a visible `:focus` state. Use large targets and readable fonts for TV viewing distance.

## Tech Stack
- Next.js (App Router)
- Tailwind CSS
- Firebase (Auth, Firestore, Analytics)
- Video.js (HLS/M3U8)

## Metrics & Analytics
- Track `channel_view` events with `province_id` and `channel_id`.
- Track `user_login` and `session_duration`.
- Comply with privacy standards; do not log PII.

## Security
- Never commit Firebase private keys or sensitive credentials.
- Use `.env.local` for environment-specific configurations.
- Ensure Firestore rules restrict access to user data.
