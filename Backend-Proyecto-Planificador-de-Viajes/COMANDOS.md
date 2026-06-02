# Activamos el Entorno Virtual para el Frontend
conda activate CrewAI-PlanificadorViajes-Front
streamlit run app.py

# ================================================================

# Levantamiento en Local
## Comando para levantar el endpoint en Local
uv sync

uv run uvicorn backend_proyecto_planificador_de_viajes.main:app --app-dir src --host 127.0.0.1 --port 8005 --reload

# ================================================================

# Despliegue sobre VPS por Contenedor de Docker
## Comando para Loguearte en Docker Desktop
docker login

docker buildx build \
  --platform linux/amd64 \
  -t kevininofuentecolque/app-crewai-conversacional-backend-ai-engineer-13:latest \
  --push \
  .
