import { EngineEvent, EventListener } from "../types"

type EventMap = Record<EngineEvent | string, EventListener[]>

class EventBus {
  private events: EventMap = {}
  private onceEvents: Set<string> = new Set()

  on(event: EngineEvent | string, listener: EventListener): () => void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(listener)

    return () => this.off(event, listener)
  }

  once(event: EngineEvent | string, listener: EventListener): void {
    const wrapped: EventListener = (...args) => {
      listener(...args)
      this.off(event, wrapped)
    }
    this.onceEvents.add(event)
    this.on(event, wrapped)
  }

  off(event: EngineEvent | string, listener: EventListener): void {
    const listeners = this.events[event]
    if (!listeners) return
    this.events[event] = listeners.filter((l) => l !== listener)
  }

  emit(event: EngineEvent | string, ...args: unknown[]): void {
    const listeners = this.events[event]
    if (!listeners) return
    const safe = [...listeners]
    for (const listener of safe) {
      try {
        listener(...args)
      } catch (err) {
        console.error(`[EventBus] Error in handler for "${event}":`, err)
      }
    }
  }

  clear(event?: EngineEvent | string): void {
    if (event) {
      delete this.events[event]
    } else {
      this.events = {}
    }
  }

  listenerCount(event: EngineEvent | string): number {
    return this.events[event]?.length ?? 0
  }
}

export const eventBus = new EventBus()
