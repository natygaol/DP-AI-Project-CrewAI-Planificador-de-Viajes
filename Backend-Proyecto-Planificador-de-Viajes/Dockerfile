# Imagen para Cloud Run. Python 3.12 (pyproject pide >=3.10,<3.13).
# Las dependencias se resuelven con uv desde uv.lock (build reproducible).
FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    # uv instala en el prefijo del sistema: uvicorn queda en el PATH, sin .venv.
    UV_PROJECT_ENVIRONMENT=/usr/local

RUN pip install --no-cache-dir uv

WORKDIR /app

# Capa de dependencias: solo se reconstruye si cambian pyproject.toml / uv.lock.
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project --no-dev

# Código de la app.
COPY . .
RUN uv sync --frozen --no-dev

# Cloud Run inyecta PORT (8080 por defecto). Uvicorn escucha en 0.0.0.0.
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "uvicorn backend_proyecto_planificador_de_viajes.main:app --app-dir src --host 0.0.0.0 --port ${PORT:-8080}"]
