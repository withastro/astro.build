class DemoIllustration extends HTMLElement {
	#cancelled: Promise<boolean> = undefined
	#cancel: () => void

	#io: IntersectionObserver

	constructor() {
		super()

		this.#cancelled = new Promise(res => {
			this.#cancel = () => res(true)
		})
	}

	connectedCallback() {
		if ('IntersectionObserver' in window) {
			this.paused = true;
			
			this.#io = new IntersectionObserver(([entry]) => {
				this.paused = !entry.isIntersecting
			})

			this.#io.observe(this)
		}

		const restart = Promise.all(
			this.getAnimations({ subtree: true }).map(anim => anim.finished)
		).then(
			() => new Promise<boolean>(res => setTimeout(() => res(false), 3500))
		)

		Promise.race([this.#cancelled, restart]).then(cancelled => {
			if (!cancelled) {
				requestAnimationFrame(() => {
					const clone = this.cloneNode(true)
					this.replaceWith(clone)
				})
			}
		})
	}

	disconnectedCallback() {
		this.#cancel()
	}

	set paused(value: boolean) {
		requestAnimationFrame(() => {
			value ? this.setAttribute('paused', '') : this.removeAttribute('paused');
		})
	}
}

if (!customElements.get('demo-illustration')) {
	customElements.define('demo-illustration', DemoIllustration)
}
