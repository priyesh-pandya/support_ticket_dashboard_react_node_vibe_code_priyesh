# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Priyesh Support" — a MERN-style support ticket dashboard. Two independent apps in one repo, run separately: a React/Vite frontend and an Express/MongoDB backend. There is no monorepo tooling (no workspaces, no root package.json) — each app has its own `package.json` and must be installed/run from its own directory.

## Commands

### Backend (`backend/`)
```bash
cd backend
npm install
npm run dev      # nodemon, auto-restart, port 5000 (or PORT from .env)
npm start        # plain node
```

### Frontend (`frontend/`)
```bash
cd frontend
npm install
npm run dev       # Vite dev server, port 5173
npm run build     # production build to frontend/dist
npm run preview   # preview the production build
```

There are no test suites or lint scripts configured in either package.

## Architecture

**Backend** — standard Express MVC-lite layering:
- `server.js` loads `.env`, connects to MongoDB via `config/db.js`, mounts `routes/ticketRoutes.js` at `/api/tickets`.
- `models/Ticket.js` — Mongoose schema: `subject`, `description`, `priority` (enum Low/Medium/High), `status` (enum Open/In Progress/Resolved, defaults to "Open"), `createdAt`.
- `routes/ticketRoutes.js` → `controllers/ticketController.js`: only two endpoints exist, 
`GET /api/tickets` (list, newest first) and 
`POST /api/tickets` (create; requires subject/description/priority).
- `backend/.env` holds `MONGO_URI` and `PORT` — already populated with a live MongoDB Atlas connection string; `.env.example` shows the shape without secrets. `.env` is gitignored.

**Frontend** — React + Vite + Tailwind + Framer Motion, all state lives in one custom hook:
- `hooks/useTickets.js` is the single source of truth for ticket data — fetches on mount, exposes `tickets`, `loading`, `submitting`, and `addTicket()`. `App.jsx` is the only consumer; it also owns toast state and passes callbacks down.
- `api/tickets.js` wraps Axios (`getTickets`, `createTicket`) against `VITE_API_URL` (defaults to `http://localhost:5000/api`).
- `components/TicketTable.jsx` switches between a `<table>` (desktop, `sm:` breakpoint up) and a stacked `TicketCard` list (mobile) — both consume the same `tickets` array, so any column/field change must be mirrored in both `TicketTable.jsx` and `TicketCard.jsx`.
- `components/NewTicketModal.jsx` is a self-contained form (local field/error state, resets on close) that calls the `onSubmit` prop passed from `App.jsx`; it does not talk to the API directly.
- `StatusBadge.jsx` / `PriorityBadge.jsx` hardcode color maps keyed to the Mongoose enum values (`Open`/`In Progress`/`Resolved`, `Low`/`Medium`/`High`) — adding a new status/priority value requires updating the enum in `models/Ticket.js` and the corresponding `STYLES` map in these components.
- Skeleton loading states (`SkeletonRow.jsx`, exports both table-row and card variants) and `EmptyState.jsx` are rendered inside `TicketTable.jsx` based on `loading`/`tickets.length`, not by the page-level component.
