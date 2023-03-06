declare module "dom-focus-lock" {
	const focusLock: {
		on: (element: HTMLElement) => void
		off: (element: HTMLElement) => void
	}
	export default focusLock
}
