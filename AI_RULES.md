# AI Rules & Tech Stack - Lernen Hub

## Tech Stack Overview
- **Framework**: React 18 with Vite for high-performance bundling and HMR.
- **Language**: TypeScript for robust type safety across game logic and data structures.
- **Styling**: Tailwind CSS for utility-first, responsive design and rapid UI development.
- **UI Components**: shadcn/ui (built on Radix UI) for accessible, high-quality interface elements.
- **Animations**: Framer Motion for smooth UI transitions and interactive game feedback.
- **Icons**: Lucide React for a consistent, lightweight, and scalable icon system.
- **State/Data**: TanStack React Query for efficient data management and potential API integration.
- **Routing**: React Router v6 for seamless client-side navigation between the hub and games.
- **Performance**: Direct DOM manipulation via `requestAnimationFrame` for high-frequency game loops (e.g., falling words).

## Library Usage Rules

### 1. UI & Components
- **shadcn/ui**: Always check `src/components/ui/` before building a new component. Use these for buttons, cards, dialogs, and form elements.
- **Lucide React**: Use exclusively for all icons. Do not import from other icon libraries.
- **Tailwind CSS**: Use utility classes for all styling. Avoid writing raw CSS unless defining global variables or complex keyframe animations in `src/index.css`.

### 2. Animations & Game Feel
- **Framer Motion**: Use for page transitions, button hovers, and "one-off" feedback animations (like score bounces or menu entries).
- **Performance-Critical Loops**: For continuous animations like the falling words in Artikel-Drop, use `requestAnimationFrame` and `refs` to manipulate the DOM directly to avoid React re-render overhead.
- **Feedback**: Use the custom `WrongAnswerExplosion` and `CorrectAnswerCelebration` components for consistent game feedback.

### 3. Data & Logic
- **Databases**: Keep all static game content (words, sentences) in `src/data/`. Follow the existing `Word` and `Sentence` interface structures.
- **Hooks**: Place reusable logic (sound, dragging, mobile detection) in `src/hooks/`.
- **Utilities**: Use the `cn()` utility from `src/lib/utils.ts` for merging Tailwind classes.

### 4. Design System
- **Typography**: Use `Space Grotesk` for general UI and `JetBrains Mono` for game-specific text (words, sentences, code-like elements).
- **Colors**: Utilize the custom CSS variables for German articles:
  - `der`: `hsl(var(--der-color))`
  - `die`: `hsl(var(--die-color))`
  - `das`: `hsl(var(--das-color))`
- **Responsiveness**: All new components must be mobile-first and tested for small screens.

### 5. Project Structure
- `src/pages/`: Main entry points for routes.
- `src/components/hub/`: Components specific to the main game selection area.
- `src/components/game/`: Components for the Artikel-Drop game.
- `src/components/satz-splitter/`: Components for the Satz-Splitter game.
- `src/components/ui/`: Reusable shadcn/ui primitives.