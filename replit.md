# Lernen Hub

## Overview
A German language learning application featuring fun, interactive games built with React + TypeScript + Vite.

### Games
- **Artikel-Drop**: Catch falling words and sort them by their German article (der, das, die). Train your instinct for German noun genders.
- **Satz-Splitter**: Rebuild German sentences by dragging words into the correct positions. Master German word order.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router v6
- **State/Data**: TanStack React Query
- **Animations**: Framer Motion
- **Charts**: Recharts

## Project Structure
- `src/pages/` - Page components (Index, NotFound)
- `src/components/hub/` - Game hub components
- `src/components/game/` - Artikel-Drop game components
- `src/components/satz-splitter/` - Satz-Splitter game components
- `src/components/ui/` - Reusable shadcn/ui components
- `src/data/` - Word and sentence databases
- `src/hooks/` - Custom React hooks (sound, drag, toast)
- `src/lib/` - Utility functions

## Development
- Dev server: `npm run dev` (runs on port 5000)
- Build: `npm run build`
- Tests: `npm test`

## Recent Changes
- 2026-02-14: Initial import to Replit environment, installed dependencies, verified app runs correctly.
