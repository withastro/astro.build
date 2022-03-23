import { createFocusTrap } from 'focus-trap'
import type { FocusTrap } from 'focus-trap'

export class AstroDrawer extends HTMLElement {
	#focusTrap: FocusTrap

	connectedCallback() {
		this.#focusTrap = createFocusTrap(this, {
			onDeactivate: this.close.bind(this),
		})

		window.addEventListener('drawer:open', this.onDrawerOpen.bind(this), false)
		window.addEventListener(
			'drawer:close',
			this.onDrawerClose.bind(this),
			false
		)

		this.addEventListener('touchmove', this.onTouchMove.bind(this), false)
	}

	onDrawerOpen(event: CustomEvent<string>) {
		if (event.detail === this.id) {
			this.open()
		}
	}

	onDrawerClose(event: CustomEvent<string>) {
		if (event.detail === this.id) {
			this.close()
		}
	}

	onTouchMove(event: TouchEvent) {
		event.preventDefault()
	}

	get id() {
		return this.getAttribute('id')
	}

	get isOpen() {
		return this.getAttribute('aria-hidden') === 'false'
	}

	open() {
		requestAnimationFrame(() => {
			this.setAttribute('aria-hidden', 'false')
			this.#focusTrap.activate()
		})
	}

	close() {
		requestAnimationFrame(() => {
			this.setAttribute('aria-hidden', 'true')
			this.#focusTrap.deactivate()
		})
	}
}

customElements.define('astro-drawer', AstroDrawer)
