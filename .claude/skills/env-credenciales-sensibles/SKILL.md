---
name: env-credenciales-sensibles
description: >-
  Cómo tratar credenciales sensibles al trabajar con archivos .env, variables de
  entorno, API keys, tokens, contraseñas, connection strings o secretos. Regla
  central: NO leas ni muestres el VALOR de una credencial sensible, pero SÍ puedes
  usarla (ejecutar procesos que la carguen, referenciarla por nombre, indicar qué
  falta). Se activa ante .env, .env.local, .env.production, secrets.*, *.pem, *.key,
  "API key", "token", "contraseña", "DATABASE_URL", "service_role", o cualquier
  petición que implique inspeccionar o configurar credenciales.
---

# Manejo de credenciales sensibles en .env

## Regla central

**No leas el valor. Sí úsalo.**

- Nunca imprimas, hagas `cat`/`echo`, muestres en el chat, cites textualmente ni
  copies a otro archivo el **valor** de una credencial sensible.
- Sí puedes **usarla**: ejecutar scripts/comandos que carguen el `.env`,
  referenciarla por su nombre (`os.getenv("OPENAI_API_KEY")`), decir a la persona
  qué variable falta o debe rellenar, y comprobar si existe o está vacía sin
  revelar el contenido.

## Qué es "sensible"

Valores de: `*_API_KEY`, `*_SECRET*`, `*_TOKEN`, `*_PASSWORD`, `*_KEY`,
`DB_PASSWORD`, `DATABASE_URL` (y cualquier connection string con usuario/clave),
claves `service_role` / `secret` de Supabase, `CREWAI_PLATFORM_INTEGRATION_TOKEN`,
tokens de acceso de Chatwoot, claves privadas (`*.pem`, `*.key`), OAuth client
secrets, webhooks firmados.

## Qué NO es sensible (se puede mostrar)

Nombres de variables, y valores de configuración no secretos: `MODEL`, `DB_PORT`,
`DB_NAME`, `DB_USER` sin clave, hosts/URLs públicas sin credenciales embebidas
(`CHATWOOT_BASE_URL`), flags booleanos, nombres de bucket o de proyecto.

## Cómo inspeccionar un .env sin exponer valores

Cuando necesites entender su estructura, enmascara siempre:

```bash
sed 's/=.*/=***/' .env            # nombres de variable + valor oculto
grep -c '^[A-Z].*=' .env          # cuántas variables hay
grep -q '^DB_PASSWORD=.\+' .env && echo "DB_PASSWORD está puesta" || echo "vacía"
```

Nunca hagas `cat .env` ni `Read` del archivo completo si el resultado va a quedar
en la salida. Si solo necesitas saber qué falta, pídelo o compáralo contra
`.env.example`.

## Si un secreto aparece por accidente

Avísalo de forma explícita y recomienda **rotar** esa credencial. No sigas como si
nada.

## Nunca

- Subir `.env` a git, pegarlo en mensajes, PRs, issues o commits.
- Enviarlo a servicios externos (headers, URLs, payloads, MCP) salvo que la persona
  lo pida explícitamente.
- Enmascarar de forma reversible dejando visible la mayor parte (`sk-proj-abcd…`
  con casi todo el token). Si hay que confirmar cuál está configurada, muestra como
  mucho 4 caracteres: `sk-…a1b2`.

## Cuándo NO aplica

`.env.example` y plantillas con placeholders (`sk-...`, `PK_...`, `tvly-...`) son
seguros de mostrar: no contienen secretos reales.
