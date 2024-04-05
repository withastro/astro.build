export class EventEmitter<EventMap extends Record<string, unknown> = Record<string, unknown>> {
	#emitter = new EventTarget();

	emit<E extends keyof EventMap>(event: E, detail?: EventMap[E]) {
		this.#emitter.dispatchEvent(new CustomEvent(event as string, detail ? { detail } : undefined));
	}

	on<E extends keyof EventMap>(event: E, callback: (detail: EventMap[E]) => void) {
		const handler = (custom: Event) => callback((custom as CustomEvent<EventMap[E]>).detail);
		this.#emitter.addEventListener(event as string, handler);
		return () => this.#emitter.removeEventListener(event as string, handler);
	}

	once<E extends keyof EventMap>(event: E, callback: (detail: EventMap[E]) => void) {
		const handler = (custom: Event) => callback((custom as CustomEvent<EventMap[E]>).detail);
		this.#emitter.addEventListener(event as string, handler, { once: true });
		return () => {};
	}
}
