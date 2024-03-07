import type { JSX } from "solid-js"

type Props = {
	children: JSX.Element
	illustration: JSX.Element
}

export default function TabLayout(props: Props) {
	return (
		<div class="grid grid-cols-1 gap-2 lg:grid-cols-3 ">
			<div class="space-y-2 rounded-xl border border-[#272831] bg-[#03000A] px-6 pb-6 pt-3 lg:col-span-2 lg:min-h-[560px]">
				{props.children}
			</div>

			<div class="order-first rounded-xl border border-[#272831] bg-[#03000A] lg:order-last lg:min-h-[560px]">
				<div class="landing-section h-full bg-[url('src/pages/db/_assets/tab-illustration-grid.png')] bg-cover bg-no-repeat p-16 lg:p-8">
					{props.illustration}
				</div>
			</div>
		</div>
	)
}
