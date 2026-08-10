# Priyesh Support — Setup & Run Guide

A full-stack support ticket dashboard: React (Vite) + Tailwind + Framer Motion frontend,
Express + MongoDB (Mongoose) backend.

## Prerequisites
- Node.js 18+ and npm
- A MongoDB connection string (Atlas or local)

## 1. Backend Setup

```bash
cd backend
npm install
```

The `.env` file is already configured with:
```
MONGO_URI=<your MongoDB connection string>
PORT=5000
```

Run the backend:
```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start       # plain node
```

You should see:
```
MongoDB connected
Server running on port 5000
```

API available at `http://localhost:5000/api/tickets`.

## 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Optionally create a `.env` file in `frontend/` if your backend runs on a different URL:
```
VITE_API_URL=http://localhost:5000/api
```
(defaults to `http://localhost:5000/api` if omitted)

Run the frontend:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

Note: the frontend now includes a ticket detail page and routing.
- Detail page URL: `/tickets/:id` (opens in a new browser tab from the list).
- Routing: the app uses `react-router-dom` (`BrowserRouter`) — run `npm install` in `frontend/` to pick up this dependency.
- Tests: frontend unit tests are available and run with `npm test` (Vitest + Testing Library).

## 3. Build for Production

```bash
cd frontend
npm run build
npm run preview   # preview the production build locally
```

## API Reference

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/api/tickets`    | List all tickets         |
| GET    | `/api/tickets/:id`| Get ticket details by ID |
| POST   | `/api/tickets`    | Create a new ticket      |
| DELETE | `/api/tickets/:id`| Delete a ticket by ID    |

Request body for `POST /api/tickets`:
```json
{
  "subject": "Cannot log in",
  "description": "Getting a 500 error on the login page.",
  "priority": "High"
}
```

Request body for `GET /api/tickets/`:
```
e.g.
http://localhost:5000/api/tickets
```

Request body for `GET /api/tickets/<id>`:
```
e.g.
http://localhost:5000/api/tickets/6a79b8ba115adc4a6b8fe69e
```

Request body for `DELETE /api/tickets/<id>`:
```
e.g.
http://localhost:5000/api/tickets/6a79b8ba115adc4a6b8fe69e
```


## Project Structure
```
priyesh-support-ticket-sys/
├── backend/    Express + MongoDB API
├── frontend/   React + Vite + Tailwind dashboard
└── SETUP.md
└── README.md
└── CLAUDE.md   For AI Assistance Project Summary
└── .gitignore
```

To run it yourself:

cd backend && npm run dev
cd frontend && npm run dev   # in a second terminal
Then open http://localhost:5173.


