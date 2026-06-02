# Project-CrewAI-Planificador-de-Viajes

Planificador de viajes conversacional construido con **CrewAI**. Un equipo de agentes de IA investiga cultura, gastronomía y logística de un destino, arma un itinerario día por día y lo **agenda automáticamente en Google Calendar** (vía la integración Tools & Integrations de la plataforma de CrewAI).

## Estructura

- **`Backend-Proyecto-Planificador-de-Viajes/`** — API FastAPI + crew de 6 agentes (CrewAI).
- **`Frontend-Proyecto-Planificador-de-Viajes/`** — Chat en Streamlit.

## Requisitos

- Python 3.10–3.12
- [uv](https://docs.astral.sh/uv/)
- Una `OPENAI_API_KEY`
- Un `CREWAI_PLATFORM_INTEGRATION_TOKEN` (Settings → Integrations en app.crewai.com) con Google Calendar conectado.

## Puesta en marcha

### Backend
```bash
cd Backend-Proyecto-Planificador-de-Viajes
cp .env.example .env   # y rellena tus claves
uv sync
uv run uvicorn backend_proyecto_planificador_de_viajes.main:app --app-dir src --host 127.0.0.1 --port 8005 --reload
```

### Frontend
```bash
cd Frontend-Proyecto-Planificador-de-Viajes
cp .env.example .env   # apunta a tu backend
streamlit run app.py
```

Luego describe tu viaje (ej. *"Cusco del 11 al 15 de julio 2026"*) y el crew generará el itinerario y creará un evento por día en tu Google Calendar.
