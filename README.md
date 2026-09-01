# Project-CrewAI-Planificador-de-Viajes

Planificador de viajes conversacional. Un **agente de LangChain** dialoga contigo hasta entender el viaje que quieres; cuando el plan está claro, delega en un **equipo de 6 agentes de CrewAI** que investiga cultura, gastronomía y logística del destino, arma el itinerario día por día y lo **agenda automáticamente en Google Calendar** (vía la integración Tools & Integrations de la plataforma de CrewAI).

Las dos capas se reparten el trabajo así:

| | Agente conversacional (LangChain) | Crew (CrewAI) |
|---|---|---|
| Qué hace | Conversa y reúne destino, fechas, viajeros, presupuesto e intereses. | Investiga, planifica, agenda y redacta. |
| Cuándo actúa | En cada mensaje. | Solo cuando el brief está completo. |
| Cuánto tarda | Segundos. | Varios minutos. |
| Memoria | Postgres (checkpointer de LangGraph). | Sin estado. |

El crew es una **tool** del agente conversacional: ya no hace falta escribir la petición perfecta de una sola vez.

## Estructura

- **`Backend-Proyecto-Planificador-de-Viajes/`** — API FastAPI + agente conversacional (LangChain 1.x) + crew de 6 agentes (CrewAI). Búsqueda en internet con **Tavily**, memoria en **Postgres**.
- **`Frontend-Proyecto-Planificador-de-Viajes/`** — Chat en **React + Vite + TypeScript + Tailwind CSS v4**, con itinerario visual por días.

## Requisitos

- Python 3.10–3.12 y [uv](https://docs.astral.sh/uv/) (backend)
- Node.js 18+ (frontend)
- Una `OPENAI_API_KEY`
- Una `TAVILY_API_KEY` (gratis en [tavily.com](https://tavily.com)) para la búsqueda en internet de los agentes.
- Un `CREWAI_PLATFORM_INTEGRATION_TOKEN` (Settings → Integrations en app.crewai.com) con Google Calendar conectado.
- Un **Postgres** (Supabase, Neon, Docker local…) para el historial de conversación:
  `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`.

## Puesta en marcha

### Backend
```bash
cd Backend-Proyecto-Planificador-de-Viajes
cp .env.example .env   # y rellena tus claves (OPENAI, TAVILY, CREWAI_PLATFORM, DB_*...)
uv sync
uv run uvicorn backend_proyecto_planificador_de_viajes.main:app --app-dir src --host 127.0.0.1 --port 8005 --reload
```

### Frontend
```bash
cd Frontend-Proyecto-Planificador-de-Viajes
npm install
npm run dev
```

Abre **http://localhost:5173**. El frontend habla con el backend en el puerto 8005 mediante el proxy de Vite (`/api` → `localhost:8005`), evitando problemas de CORS en desarrollo.

Luego empieza a conversar. No hace falta que lo digas todo de golpe: basta con *"quiero ir a Cusco"* y el agente te irá preguntando lo que falte (o usa los filtros Dónde/Cuándo/Quién/Presupuesto para adelantarlo). Cuando tenga el plan claro, te pedirá confirmación y lanzará al equipo, que generará el itinerario y creará un evento por día en tu Google Calendar.

> La primera vez, aplica las migraciones de `Backend-.../conversational_agent/migraciones_SQL/`. Están explicadas en el README del backend.
