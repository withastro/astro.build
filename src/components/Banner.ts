class NotMarquee extends HTMLElement {
	#io: IntersectionObserver

	connectedCallback() {
		if ('IntersectionObserver' in window) {
			this.visible = false;

			this.#io = new IntersectionObserver(([entry]) => {
				this.visible = entry.isIntersecting
			})

			this.#io.observe(this)
		}

		this.checkbox.addEventListener('change', this.onCheckboxChanged.bind(this))

		if (window.localStorage.getItem('astro:marquee-paused') === 'false') {
			requestAnimationFrame(() => this.checkbox.checked = false)
		}
	}

	set visible(value: boolean) {
		requestAnimationFrame(() => {
			this.setAttribute('visible', `${value}`)
		})
	}

	get checkbox(): HTMLInputElement {
		return this.querySelector('#marquee-pause')
	}

	onCheckboxChanged() {
		const paused = this.checkbox.checked
		window.localStorage.setItem('astro:marquee-paused', `${paused}`)
	}

	onCheckboxKeydown(event: KeyboardEvent) {
		const { key } = event
		if (key !== 'Enter') return
		this.onCheckboxChanged()
	}
}

customElements.define('not-marquee', NotMarquee)
