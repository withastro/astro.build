class StarField extends HTMLElement {
	#io: IntersectionObserver

	connectedCallback() {
		if ('IntersectionObserver' in window) {
			this.#io = new IntersectionObserver(([entry]) => {
				this.visible = entry.isIntersecting
			})

			this.#io.observe(this)
		}
	}

	set visible(value: boolean) {
		requestAnimationFrame(() => {
			this.setAttribute('visible', `${value}`)
		})
	}
}

customElements.define('star-field', StarField)
