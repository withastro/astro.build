import clsx from "clsx"
import { createEffect, createSignal, onCleanup, onMount, splitProps, type JSX } from "solid-js"

export default function Collapse(
	props: { children: JSX.Element; isOpen: boolean } & JSX.IntrinsicElements["div"],
) {
	const [, divProps] = splitProps(props, ["children", "isOpen"])
	const [contentHeight, setContentHeight] = createSignal()

	let outer: HTMLElement | undefined
	let inner: HTMLElement | undefined

	createEffect(() => {
		const ro = new ResizeObserver(([entry]) => {
			setContentHeight(entry.contentRect.height)
		})
		ro.observe(inner!)
		onCleanup(() => {
			ro.disconnect()
		})
	})

	onMount(() => {
		inner!.style.position = "absolute"
	})

	createEffect(() => {
		outer!.style.height = props.isOpen ? contentHeight() + "px" : "0px"
	})

	return (
		<div
			{...divProps}
			class={clsx("relative overflow-hidden transition-[height]", divProps.class)}
			ref={(el) => (outer = el)}
		>
			<div ref={(el) => (inner = el)}>{props.children}</div>
		</div>
	)
}
