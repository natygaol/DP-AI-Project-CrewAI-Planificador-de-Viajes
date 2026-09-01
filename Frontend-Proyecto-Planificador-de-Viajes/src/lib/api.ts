import type { ChatResponse, PlanTripResponse } from "../types";

// Base del backend.
// En desarrollo: "/api" -> proxy de Vite -> http://localhost:8005.
// En producción: la URL pública del backend (VITE_API_BASE).
const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "/api";

// El crew puede tardar varios minutos, y con el agente conversacional ese
// tiempo cae dentro de un turno normal de /chat (la tool corre dentro del
// bucle del agente). Por eso el timeout alto también aquí.
const TIMEOUT_MS = 600_000; // 10 min

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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

    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Un turno de conversación con el agente (LangChain).
 *
 * Responde en segundos mientras reúne los datos del viaje. El turno en que
 * decide lanzar el crew tarda minutos y devuelve además `itinerary` con el
 * markdown real del crew.
 *
 * @param threadId Identidad del hilo: mismo valor = misma memoria en el backend.
 */
export function chat(message: string, threadId: string): Promise<ChatResponse> {
  return postJSON<ChatResponse>("/chat", { message, thread_id: threadId });
}

/**
 * Dispara el crew directamente, sin conversación. Se mantiene por
 * compatibilidad; el flujo normal de la UI usa `chat()`.
 */
export function planTrip(prompt: string): Promise<PlanTripResponse> {
  return postJSON<PlanTripResponse>("/plan-trip", { prompt });
}
