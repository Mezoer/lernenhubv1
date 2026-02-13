# Lernen Hub

## Overview
A German language learning game hub built with React, TypeScript, and Vite. Features interactive games to help users master German grammar including article genders and sentence structure.

## Recent Changes
- 2026-02-13: Migrated from Lovable to Replit environment. Updated Vite config for port 5000 and allowed all hosts. Removed lovable-tagger plugin reference.

## Project Architecture
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: react-router-dom v6
- **State Management**: @tanstack/react-query
- **Animations**: framer-motion

### Directory Structure
```
src/
├── components/
│   ├── game/          # Artikel-Drop game components
│   ├── hub/           # Game hub/landing page
│   ├── satz-splitter/ # Satz-Splitter game components
│   └── ui/            # shadcn/ui base components
├── data/              # Word and sentence databases
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Route pages (Index, NotFound)
├── App.tsx            # Root component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles
```

### Games
1. **Artikel-Drop**: Catch falling words and sort by German article (der, das, die)
2. **Satz-Splitter**: Rebuild German sentences by dragging words into correct positions

## Deployment
- Static site deployment via Vite build
- Build output: `dist/`
- Dev server: port 5000
