import { createEffect, createSignal } from "solid-js"

export function createDisclosure({
	button,
	content,
	animated = false,
	closeAt = -1,
}: {
	button: HTMLElement
	content: HTMLElement
	animated?: boolean
	closeAt?: number
}) {
	if (content.id) {
		button.setAttribute("aria-controls", content.id)
	}

	if (closeAt > 0) {
		const mediaQuery = window.matchMedia(`(min-width: ${closeAt}px)`)

		mediaQuery.addEventListener("change", (event: MediaQueryListEvent) => {
			if (event.matches) {
				setVisible(false)
			}
		})
	}

	const [visible, setVisible] = createSignal(false)

	createEffect(() => {
		button.setAttribute("aria-expanded", String(visible()))

		if (visible()) {
			content.style.removeProperty("display")
		}

		if (!visible() && !animated) {
			content.style.display = "none"
		}
		/* make sure page scrolling is disabled when the menu is open */
		if (visible()) {
			document.documentElement.classList.add("disclosure-open")
		}

		// run after an animation frame to let the element start at the leave state
		requestAnimationFrame(() => {
			if (visible()) {
				content.dataset.open = "true"
			} else {
				delete content.dataset.open
			}
		})
	})

	content.addEventListener("transitionstart", () => {})

	if (animated) {
		content.addEventListener("transitionend", () => {
			if (!visible()) {
				content.style.display = "none"
				document.documentElement.classList.remove("disclosure-open")
			}
		})
	}

	button.addEventListener("click", () => {
		setVisible(!visible())
	})

	content.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			setVisible(false)
			button.focus()
		}
	})

	const handleFocusLost = (event: FocusEvent) => {
		// close the menu when losing focus from it
		if (content.contains(event.target as Node)) return
		// ignore if the new target is the button, it's click handler will handle it
		if (event.target === button) return
		event.stopPropagation()
	}

	const handleClickOutside = (event: MouseEvent) => {
		// close on click outside
		if (
			visible() &&
			!content.contains(event.target as Node) &&
			!button.contains(event.target as Node)
		) {
			setVisible(false)
			button.focus()
		}
	}

	createEffect(() => {
		if (visible()) {
			window.addEventListener("click", handleClickOutside)
			window.addEventListener("focusin", handleFocusLost)
		} else {
			window.removeEventListener("click", handleClickOutside)
			window.removeEventListener("focusin", handleFocusLost)
		}
	})
}
