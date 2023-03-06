import { createSignal } from "solid-js"

const [windowScroll, setWindowScroll] = createSignal(window.scrollY)

window.addEventListener(
	"scroll",
	() => {
		setWindowScroll(window.scrollY)
	},
	{ passive: true },
)

export { windowScroll }
