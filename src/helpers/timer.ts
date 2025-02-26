import { signal } from '@preact/signals-core';

export function createTimer(duration: number) {
	const running = signal(false);
	let timeout: ReturnType<typeof setTimeout> | undefined;
	return {
		running,
		start() {
			running.value = true;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				running.value = false;
			}, duration);
		},
		stop() {
			running.value = false;
			clearTimeout(timeout);
		},
	};
}
