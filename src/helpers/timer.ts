import { createSignal } from "solid-js"

export function createTimer(duration: number) {
	const [running, setRunning] = createSignal(false)
	let timeout: ReturnType<typeof setTimeout> | undefined
	return {
		running,
		start() {
			setRunning(true)
			clearTimeout(timeout)
			timeout = setTimeout(() => {
				setRunning(false)
			}, duration)
		},
		stop() {
			setRunning(false)
			clearTimeout(timeout)
		},
	}
}
