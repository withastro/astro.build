import type { JSX } from "solid-js"

type Props = {
	children: JSX.Element
	illustration: JSX.Element
}

export default function TabLayout(props: Props) {
	return (
		<div class="grid grid-cols-1 gap-2 lg:h-[32rem] lg:grid-cols-3">
			<div class="relative h-full max-h-[32rem] space-y-2 overflow-y-auto rounded-xl border border-[#272831] bg-[#03000A] px-6 pb-6 pt-3 lg:col-span-2">
				{props.children}
			</div>

			<div class="order-first h-full rounded-xl border border-[#272831] bg-[#03000A] sm:max-h-[32rem] lg:order-last">
				<div class="h-full bg-[url('src/pages/db/_assets/tab-illustration-grid.png')] bg-cover bg-no-repeat">
					{props.illustration}
				</div>
			</div>
		</div>
	)
}
