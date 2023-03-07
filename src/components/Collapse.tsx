import clsx from "clsx";
import { createEffect, createSignal, JSX, onCleanup, onMount, splitProps } from "solid-js";

export default function Collapse(
	props: { children: JSX.Element; isOpen: boolean } & JSX.IntrinsicElements["div"],
) {
	const [, divProps] = splitProps(props, ["children", "isOpen"])

	const inner = (<div>{props.children}</div>) as HTMLElement

	const [contentHeight, setContentHeight] = createSignal(inner.clientHeight)

	const outer = (
		<div {...divProps} class={clsx("relative overflow-hidden transition-[height]", divProps.class)}>
			{inner}
		</div>
	) as HTMLElement

	const ro = new ResizeObserver(([entry]) => {
		setContentHeight(entry.contentRect.height)
	})
	ro.observe(inner)

	onCleanup(() => {
		ro.disconnect()
	})

	onMount(() => {
		inner.style.position = "absolute"
	})

	createEffect(() => {
		outer.style.height = props.isOpen ? `${contentHeight()}px` : "0"
	})

	return outer
}
