import { createSignal, For, type JSX } from "solid-js"
import { getElement, getElements } from "~/helpers/dom.js"
import ChevronIcon from "~/icons/ChevronIcon.jsx"
import CheckCircleIcon from "~/icons/integrations/CheckCircleIcon.jsx"

/** modulo, but it loops on negatives */
const negativeMod = (a: number, b: number) => ((a % b) + b) % b

export function DropdownMultiSelect(props: {
	name?: string
	descriptionId?: string
	options: { label: string; value: string }[]
	defaultSelected?: string[]
}) {
	const [values, setValues] = createSignal(new Set(props.defaultSelected ?? []))

	const handleKeyDown: JSX.EventHandler<HTMLDetailsElement, KeyboardEvent> = (event) => {
		const toggle = getElement("[data-toggle]", HTMLElement, event.currentTarget)

		// close the dropdown and focus the toggle if the user presses escape
		if (event.key === "Escape") {
			event.preventDefault()
			event.currentTarget.open = false
			toggle?.focus()
			return
		}

		// open the dropdown if the toggle is focused and the user presses down or up
		if (
			document.activeElement === toggle &&
			(event.key === "ArrowDown" || event.key === "ArrowUp")
		) {
			event.preventDefault()
			event.currentTarget.open = true
		}

		// cycle through focus targets with up and down
		const targets = getElements("[data-focus-target]", HTMLElement, event.currentTarget)
		const focusedIndex = [...targets].findIndex((option) => option === document.activeElement)
		if (event.key === "ArrowDown") {
			event.preventDefault()
			targets[negativeMod(focusedIndex + 1, targets.length)]?.focus()
		} else if (event.key === "ArrowUp") {
			event.preventDefault()
			targets[negativeMod(focusedIndex - 1, targets.length)]?.focus()
		}
	}

	return (
		<details
			class="group input p-0"
			aria-describedby={props.descriptionId}
			onKeyDown={handleKeyDown}
		>
			<summary
				data-toggle
				data-focus-target
				class="accordion flex cursor-pointer select-none list-none items-center p-3 leading-tight"
			>
				<div class="flex flex-1 flex-wrap gap-1">
					<For
						each={props.options.filter((option) => values().has(option.value))}
						fallback={<span class="opacity-75">Choose all that apply</span>}
					>
						{(option) => (
							<span class="rounded border border-astro-gray-300 bg-astro-gray-500 p-1 text-sm leading-none">
								{option.label}
							</span>
						)}
					</For>
				</div>
				<ChevronIcon aria-hidden="true" class="h-4 w-4 transition group-open:rotate-180" />
			</summary>
			<div class="grid max-h-60 gap-1 overflow-y-auto p-1">
				<For each={props.options}>
					{(option) => (
						<label class="relative flex items-center rounded p-2 leading-tight transition hover:bg-black/50">
							<span class="flex-1">{option.label}</span>
							<input
								data-focus-target
								type="checkbox"
								name={props.name}
								value={option.value}
								class="peer absolute inset-0 cursor-pointer appearance-none rounded outline-none ring-astro-gray-200 focus-visible:ring-2"
								onInput={(event) => {
									setValues((values) => {
										const newValues = new Set(values)
										if (event.currentTarget.checked) {
											newValues.add(event.currentTarget.value)
										} else {
											newValues.delete(event.currentTarget.value)
										}
										return newValues
									})
								}}
								onKeyDown={(event) => {
									if (event.key === "Enter") {
										event.preventDefault()
										event.currentTarget.click()
									}
								}}
							/>
							<CheckCircleIcon
								aria-hidden="true"
								class="h-5 w-5 opacity-0 transition peer-checked:opacity-100"
							/>
						</label>
					)}
				</For>
			</div>
		</details>
	)
}
