## Agent Studio (Dify-like) – Frontend

A Next.js + TypeScript app that provides an agent workflow canvas similar to Dify’s agent platform, using React Flow for diagramming and MUI for UI.

### Tech Stack
- Next.js 14 (App Router) + TypeScript
- MUI (Material UI) for components and theming
- React Flow for the canvas
- Zustand for lightweight state management
- Tailwind base from the scaffold (minimal usage)

### App Structure
- `/` – Landing page with quick links
- `/agents` – Placeholder agent list
- `/agents/[id]` – Canvas + Inspector layout

Core components:
- `src/components/AgentCanvas.tsx` – React Flow canvas
- `src/components/InspectorPanel.tsx` – Node inspector
- `src/components/layout/TopBar.tsx` – App top navigation
- `src/components/providers/ClientThemeProvider.tsx` – MUI theme provider
- `src/store/flowStore.ts` – Zustand store for nodes/edges

### Getting Started
Install dependencies and run the dev server:
```bash
npm install
npm run dev
```
Open http://localhost:3000

### Build
```bash
npm run build
npm run start
```

### Development Notes
- The canvas is pre-seeded with a simple graph. Click a node to edit its label in the inspector.
- MUI theming is applied globally via `ClientThemeProvider` in `src/app/layout.tsx`.

### Deploy
You can deploy to any Node-compatible host. For Vercel:
```bash
npm run build
# Then connect the repo on Vercel and deploy
```

### License
MIT (or update as needed)
