import { createEffect, createSignal } from "solid-js"
import ChevronIcon from "~/icons/ChevronIcon.jsx"
import LayersIcon from "~/icons/LayersIcon.jsx"
import OpenBookIcon from "~/icons/OpenBookIcon.jsx"
import PaletteIcon from "~/icons/PaletteIcon.jsx"
import Collapse from "./Collapse.tsx"

export default function ResourcesDropdown() {
	const [open, setOpen] = createSignal(false)
	const details = (
		// includes "p-6 border-t-[1px] border-astro-gray-500"
		// because astro-island blocks these styles from being applied
		<details
			class="group border-t-[1px] border-astro-gray-500 p-6"
			onClick={(event) => {
				event.preventDefault()
				setOpen(!open())
			}}
		>
			<summary class="accordion link flex cursor-pointer list-none items-center justify-between">
				Resources
				<ChevronIcon class="inline-block rotate-0 transition-transform group-open:-rotate-180" />
			</summary>

			<Collapse
				isOpen={open()}
				onTransitionEnd={() => {
					if (details.open && !open()) details.open = false
				}}
			>
				<div class="mt-4 flex flex-col gap-4 text-2xl font-light">
					<a href="/themes/" data-astro-prefetch class="link flex items-center gap-4">
						<PaletteIcon /> Themes
					</a>
					<a href="/integrations/" data-astro-prefetch class="link flex items-center gap-4">
						<LayersIcon /> Integrations
					</a>
					<a
						href="https://docs.astro.build/en/tutorial/0-introduction/"
						class="link flex items-center gap-4"
					>
						<OpenBookIcon /> Tutorials
					</a>
				</div>
			</Collapse>
		</details>
	) as HTMLDetailsElement

	createEffect(() => {
		if (open()) details.open = true
	})

	return details
}
