/**
 * Indicador breve mientras el agente conversacional redacta su turno.
 *
 * Se usa solo en los primeros segundos: si la espera se alarga es porque el
 * agente lanzó el crew, y App.tsx cambia a la línea de tiempo (AgentProgress).
 */
export default function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
