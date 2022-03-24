class DemoIllustration extends HTMLElement {
	#timer = undefined
	#cancelled: Promise<boolean> = undefined
	#cancel: () => void

	constructor() {
		super()

		this.#cancelled = new Promise(res => {
			this.#cancel = () => res(true)
		})
	}

	connectedCallback() {
		const restart = Promise.all(
			this.getAnimations({ subtree: true }).map(anim => anim.finished)
		).then(
			() => new Promise<boolean>(res => setTimeout(() => res(false), 3500))
		)

		Promise.race([this.#cancelled, restart]).then(cancelled => {
			if (!cancelled) {
				const clone = this.cloneNode(true)
				this.replaceWith(clone)
			}
		})
	}

	disconnectedCallback() {
		this.#cancel()
	}
}

if (!customElements.get('demo-illustration')) {
	customElements.define('demo-illustration', DemoIllustration)
}
