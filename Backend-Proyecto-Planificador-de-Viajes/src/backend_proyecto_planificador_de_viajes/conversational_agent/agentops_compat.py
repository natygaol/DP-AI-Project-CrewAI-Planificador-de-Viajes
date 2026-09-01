"""
Parche de compatibilidad entre AgentOps y LangChain 1.x (`create_agent`).

EL PROBLEMA
-----------
`agentops.init()` (lo llama crew.py al importarse) instrumenta LangGraph y, entre
otras cosas, envuelve `StateGraph.add_node`. Ese wrapper re-envuelve la funcion
del nodo con `functools.wraps(original_func)`.

Con LangChain 1.x eso rompe: `create_agent` no pasa funciones a `add_node`, pasa
instancias de `RunnableCallable`. `functools.wraps` copia `__wrapped__`
apuntando a esa instancia, y cuando LangGraph hace `inspect.signature()` sobre
el resultado, `inspect` sigue el `__wrapped__` y muere con:

    TypeError: descriptor '__call__' for 'type' objects doesn't apply to a
    'RunnableCallable' object

Sintoma: TODA llamada a create_agent falla, aunque el codigo del agente sea
correcto. El traceback no menciona a AgentOps por ningun lado.

LA SOLUCION
-----------
Quitar SOLO ese wrapper y dejar el resto de la instrumentacion en pie: el
tracing de CrewAI (que es para lo que esta AgentOps en este proyecto) y el resto
del de LangGraph (`StateGraph.__init__`, `compile`, `Pregel.invoke/stream`)
siguen funcionando. Lo unico que se pierde son los spans por nodo del grafo
conversacional.

Cuando AgentOps arregle su instrumentador, este modulo se puede borrar entero:
`verificar()` deja de encontrar el wrapper y no hace nada.
"""

_ya_aplicado = False


def desactivar_wrapper_add_node() -> bool:
    """Desenvuelve `StateGraph.add_node` si AgentOps lo parcheo. Idempotente.

    Returns:
        True si quito el wrapper, False si no habia nada que quitar.
    """
    global _ya_aplicado

    if _ya_aplicado:
        return False

    try:
        from langgraph.graph.state import StateGraph
    except ImportError:
        return False

    envuelto = StateGraph.__dict__.get("add_node")
    # Solo tocamos si esta envuelto por wrapt (lo que usa AgentOps). Una funcion
    # normal no tiene __wrapped__, asi que sin AgentOps esto no hace nada.
    original = getattr(envuelto, "__wrapped__", None)
    if original is None:
        return False

    StateGraph.add_node = original
    _ya_aplicado = True
    print(
        "🩹 Parche aplicado: se desactivo el wrapper de AgentOps sobre "
        "StateGraph.add_node (rompe create_agent de LangChain 1.x). "
        "El resto del tracing sigue activo."
    )
    return True
