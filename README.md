# gradio4-react-compose-lab

Minimal monorepo demonstrating four Gradio services alongside a React frontend
with Docker Compose.

## Services

| Service | Port |
|---------|------|
| Text    | 7861 |
| Vision  | 7862 |
| Audio   | 7863 |
| Tools   | 7864 |
| Frontend| 8080 |

Each Gradio app lives in `services/<name>` with its own `Dockerfile` and
`app.py`. The React frontend (Vite + Tailwind + shadcn/ui style) is in
`frontend` and served through Nginx.

## Usage

```bash
docker compose up -d --build
```

Then open http://localhost:8080 to access the dashboard linking to each
Gradio demo.
