# Frontend — Planificador de Viajes IA (React + Vite)

Interfaz de chat para el planificador de viajes. UI en **React + Vite +
TypeScript + Tailwind CSS v4**, que renderiza el itinerario de forma visual
(tarjetas plegables por día) en lugar de texto plano.

Habla con el endpoint `/chat` del backend: una conversación real con el agente
de LangChain, que internamente decide cuándo lanzar el crew de CrewAI.

## Requisitos

- Node.js 18+ (probado con Node 26)
- El backend (FastAPI + CrewAI) corriendo, por defecto en `http://localhost:8005`

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre http://localhost:5173

En desarrollo, Vite hace de proxy: el frontend llama a `/api/chat` y se
reenvía a `http://localhost:8005/chat`, evitando problemas de CORS. Si tu
backend corre en otro origen:

```bash
BACKEND_ORIGIN=http://localhost:8080 npm run dev
```

## Variables de entorno

`.env`:

```
VITE_API_BASE=/api
```

- **Desarrollo:** déjalo como `/api` (usa el proxy de Vite).
- **Producción:** apunta a la URL pública del backend, p.ej.
  `VITE_API_BASE=https://mi-backend.run.app`.

> Antes se llamaba `VITE_BACKEND_URL` y apuntaba a la ruta completa
> (`/api/plan-trip`). Ahora es la **base**, porque el frontend usa dos rutas.

## Build de producción

```bash
npm run build      # genera dist/
npm run preview    # sirve dist/ localmente
```

## Estructura

```
src/
  App.tsx                 # Estado del chat y orquestación
  lib/
    api.ts                # Cliente de /chat y /plan-trip
    parseItinerary.ts     # Parseo del markdown a días
  components/
    Sidebar.tsx
    ChatInput.tsx
    ChatMessageView.tsx   # Burbuja o itinerario visual según el contenido
    TypingIndicator.tsx   # Puntitos: turno conversacional (segundos)
    AgentProgress.tsx     # Línea de tiempo: el crew corriendo (minutos)
    ItineraryView.tsx     # Cabecera + intro + tarjetas por día
    DayCard.tsx           # Tarjeta plegable de un día
    Markdown.tsx          # Renderizador de markdown con estilos del tema
  types.ts
```

## Contrato con el backend

`POST {VITE_API_BASE}/chat` con body `{ "message": "...", "thread_id": "..." }`:

```json
{
  "reply": "…lo que responde el agente…",
  "itinerary": null
}
```

`itinerary` viene `null` en los turnos de charla. En el turno en que el agente
lanza el crew (varios minutos) trae el itinerario:

```json
{
  "reply": "Listo, ya tienes tu itinerario.",
  "itinerary": {
    "chat_response": "…markdown…",
    "download_content": "…itinerario completo en markdown…",
    "download_filename": "itinerary.md"
  }
}
```

### Los dos indicadores de espera

Como el turno que lanza el crew tarda minutos y el resto segundos, la UI no
sabe de antemano cuál le tocó. La resuelve por tiempo: muestra
`TypingIndicator` (puntitos) y, si a los **6 segundos** sigue esperando, cambia
a `AgentProgress` (la línea de tiempo de los 6 agentes). El umbral está en
`SEGUNDOS_HASTA_CREW`, en `App.tsx`.

### El hilo de conversación

`thread_id` se genera con `crypto.randomUUID()` al montar la app y se mantiene
mientras dure la conversación: es lo que hace que el agente recuerde. "Nuevo
viaje" en el sidebar genera uno nuevo, que equivale a empezar de cero.
