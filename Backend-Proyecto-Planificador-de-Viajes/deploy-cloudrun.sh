#!/usr/bin/env bash
# Despliega el backend en Cloud Run. Ejecutar:  bash deploy-cloudrun.sh
set -euo pipefail

PROJECT="datapath-17-agent-2026"
REGION="us-central1"
SERVICE="planificador-viajes-backend"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Secretos: cada entrada es  VAR_EN_CONTENEDOR=NOMBRE_SECRETO:VERSION
SECRETS="OPENAI_API_KEY=OPENAI_API_KEY:latest"
SECRETS+=",DB_USER=DB_USER:latest"
SECRETS+=",DB_PASSWORD=DB_PASSWORD:latest"
SECRETS+=",DB_HOST=DB_HOST:latest"
SECRETS+=",DB_PORT=DB_PORT:latest"
SECRETS+=",DB_NAME=DB_NAME:latest"
SECRETS+=",SUPABASE_URL=SUPABASE_URL:latest"
SECRETS+=",SUPABASE_SECRET_KEY=SUPABASE_SECRET_KEY:latest"
SECRETS+=",TAVILY_API_KEY=TAVILY_API_KEY:latest"
SECRETS+=",AGENTOPS_API_KEY=AGENTOPS_API_KEY:latest"
SECRETS+=",QDRANT_URL=QDRANT_URL:latest"
SECRETS+=",QDRANT_API_KEY=QDRANT_API_KEY:latest"
SECRETS+=",QDRANT_COLLECTION=QDRANT_COLLECTION:latest"
SECRETS+=",CREWAI_PLATFORM_INTEGRATION_TOKEN=CREWAI_PLATFORM_INTEGRATION_TOKEN:latest"
SECRETS+=",CHATWOOT_BASE_URL=CHATWOOT_BASE_URL:latest"
SECRETS+=",CHATWOOT_ACCOUNT_ID=CHATWOOT_ACCOUNT_ID:latest"
SECRETS+=",CHATWOOT_API_ACCESS_TOKEN=CHATWOOT_API_ACCESS_TOKEN:latest"

gcloud run deploy "$SERVICE" \
  --project="$PROJECT" \
  --region="$REGION" \
  --source="$SOURCE_DIR" \
  --allow-unauthenticated \
  --timeout=3600 \
  --memory=2Gi \
  --cpu=2 \
  --port=8080 \
  --set-env-vars="MODEL=gpt-5.1" \
  --set-secrets="$SECRETS" \
  --quiet
