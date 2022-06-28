class NotMarquee extends HTMLElement {
	connectedCallback() {
		this.checkbox.addEventListener('change', this.onCheckboxChanged.bind(this))

		if (window.localStorage.getItem('astro:marquee-paused') === 'false') {
			requestAnimationFrame(() => (this.checkbox.checked = false))
		}
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
