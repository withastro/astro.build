import { supported } from '../utils/passive.js'

function flyout(elem: HTMLDetailsElement) {
	elem.addEventListener(
		'mouseenter',
		() => {
			elem.setAttribute('open', 'open')
		},
		supported ? { passive: true } : false
	)
	elem.addEventListener(
		'mouseleave',
		() => {
			elem.removeAttribute('open')
		},
		supported ? { passive: true } : false
	)
}

Array.from(document.querySelectorAll<HTMLDetailsElement>('details.flyout')).map(
	flyout
)
