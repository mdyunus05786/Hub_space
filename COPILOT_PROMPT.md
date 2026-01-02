# Copilot prompt (paste this into Copilot Chat)

Build a **HubSpace** web app with a **React (Vite) frontend** and a **Django backend**.

## Product
- The main screen is called **“Space”** (dashboard).
- Space contains **widgets** (cards) that the user can **drag and resize**.
- A “**Widgets**” button opens a picker that lets the user add/remove widgets.

## Widgets
1) **Today Tasks**: show tasks due today; allow one-click complete.
2) **Task List**: search/filter tasks; click to open task detail.
3) **Performance**: show KPIs (completed today, remaining today, active tasks) + 7‑day completed trend.
4) **Completed**: list recently completed tasks.

## Pages
- / (Space dashboard)
- /tasks (add new task + active list)
- /tasks/:id (task detail/edit, complete, delete)
- /completed
- /analytics

## Backend API (Django)
Create SQLite models:
- Task(title, description, due_date, priority, estimate_minutes, is_completed, created_at, completed_at)
- TaskVisit(task FK, action, visited_at) (action: view/create/update/complete)

Expose JSON endpoints:
- GET/POST /api/tasks
- GET/PUT/DELETE /api/tasks/<id>
- POST /api/tasks/<id>/complete
- POST /api/tasks/<id>/visit
- GET /api/analytics/summary

The React app should use axios and an env var `VITE_API_BASE_URL` defaulting to http://localhost:8000.

## UI requirements
- Modern, clean, “dashboard” look.
- Draggable/resizable widgets (react-grid-layout or similar).
- Persist dashboard layout in localStorage.
- Use React Router.

Deliver production-quality code with clear folder structure and reasonable comments.
