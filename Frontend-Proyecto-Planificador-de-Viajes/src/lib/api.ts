import type { PlanTripResponse } from "../types";

// En desarrollo, VITE_BACKEND_URL = /api/plan-trip (proxy de Vite -> localhost:8005).
// En producción, se define la URL pública completa del backend.
const BACKEND_URL: string =
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ?? "/api/plan-trip";

/**
 * Envía la petición de viaje al backend (CrewAI) y devuelve la respuesta estructurada.
 * El crew puede tardar varios minutos, por eso el timeout es alto (10 min).
 */
export async function planTrip(prompt: string): Promise<PlanTripResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 600_000); // 10 min

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    if (!res.ok) {
      let detail = "";
      try {
        const data = await res.json();
        detail = data?.details || data?.message || "";
      } catch {
        /* respuesta no-JSON */
      }
      throw new Error(
        `El servidor respondió ${res.status}${detail ? `: ${detail}` : ""}`
      );
    }

    return (await res.json()) as PlanTripResponse;
  } finally {
    clearTimeout(timeout);
  }
}
