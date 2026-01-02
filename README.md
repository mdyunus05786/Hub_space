# HubSpace (React + Django)

This repo contains:
- **React (Vite)** frontend with a draggable/resizable **Space** dashboard.
- **Django** backend storing tasks in SQLite and serving a simple JSON API.

## 1) Backend (Django)

From the project root:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver 8000
```

API base: http://localhost:8000

## 2) Frontend (Vite)

```bash
npm install
npm run dev
```

Optional: point the frontend to a different backend:

```bash
# Windows PowerShell
$env:VITE_API_BASE_URL="http://localhost:8000"

# macOS/Linux
export VITE_API_BASE_URL="http://localhost:8000"
```

Then visit the Vite URL printed in the terminal (usually http://localhost:5173).

## Notes
- Widget layout is stored in **localStorage**.
- CORS is enabled for local development.
