---
name: supabase-schema-mcp
description: >-
  Usa SIEMPRE el MCP de Supabase para cualquier interacción con una base de datos
  Supabase: crear, alterar o eliminar tablas, columnas, índices, vistas, esquemas,
  políticas RLS, triggers, funciones o extensiones; aplicar o revisar migraciones;
  inspeccionar la estructura existente; ejecutar consultas SQL puntuales; generar
  tipos TypeScript; revisar advisors de seguridad/rendimiento; o gestionar edge
  functions y ramas (branches). Se activa ante palabras como Supabase, migración,
  tabla, esquema, RLS, "crea la tabla", "añade una columna", "borra la tabla",
  "cambia el esquema" cuando el destino es Supabase/Postgres gestionado.
---

# Supabase vía MCP

Cuando el trabajo implique tocar una base de datos Supabase, **no** escribas SQL a
mano en archivos sueltos, ni uses `psql`, `supabase db push` u otras vías por CLI, ni
supongas la estructura. Usa las herramientas del servidor MCP `supabase`
(`mcp__supabase__*`). El MCP es la fuente de verdad y la vía de ejecución.

## Flujo de trabajo

1. **Entiende antes de cambiar.** Ejecuta `list_projects` (si hay dudas del
   proyecto) y `list_tables` para conocer el esquema actual. Para cambios sobre algo
   existente, revisa también `list_migrations`.
2. **Cambios de esquema (DDL) → `apply_migration`.** Todo `CREATE / ALTER / DROP` de
   tablas, columnas, índices, vistas, esquemas, políticas RLS, triggers, funciones o
   extensiones va como migración con nombre en `snake_case` descriptivo
   (p. ej. `add_trips_table`, `add_user_id_to_itineraries`). Así queda versionado.
3. **Consultas y datos puntuales → `execute_sql`.** `SELECT`, inspección de filas,
   backfills pequeños o comprobaciones. No lo uses para DDL.
4. **Después de cambiar el esquema**, ejecuta `get_advisors` (tipo `security` y
   `performance`) y corrige lo que aplique — sobre todo RLS deshabilitado en tablas
   nuevas y claves foráneas sin índice.
5. **Si el frontend consume estos datos**, ofrece regenerar tipos con
   `generate_typescript_types`.

## Reglas

- **Operaciones destructivas** (`DROP TABLE/COLUMN/SCHEMA`, `DELETE` sin `WHERE`,
  `TRUNCATE`, borrar funciones o políticas): confirma con la persona usuaria antes de
  ejecutarlas, mostrando exactamente qué se va a perder.
- **RLS por defecto.** Al crear una tabla, habilita RLS y define políticas explícitas
  en la misma migración salvo que se pida lo contrario.
- **Cambios de riesgo**: propón usar `create_branch` para probar en una rama de
  desarrollo y luego `merge_branch`, en vez de aplicar directo a producción.
- **Nombres de migración** claros y en inglés `snake_case`; una migración por unidad
  lógica de cambio.
- Para depurar problemas de base de datos, empieza por `get_logs` / `get_advisors`
  antes de proponer cambios.
- Edge functions: usa `list_edge_functions`, `get_edge_function` y
  `deploy_edge_function` en lugar de despliegues manuales.

## Cuándo NO usar este skill

Si la base de datos no es Supabase (SQLite local, Postgres propio sin MCP, otro
proveedor), ignora este skill y usa las herramientas normales del proyecto.
