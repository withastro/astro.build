import type { JSX } from "solid-js"

type Props = {
	children: JSX.Element
	illustration: JSX.Element
}

export default function TabLayout(props: Props) {
	return (
		<div class="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:h-[32rem]">
			<div class="max-h-[32rem] h-full space-y-2 rounded-xl border border-[#272831] bg-[#03000A] px-6 pb-6 pt-3 lg:col-span-2 overflow-y-auto relative">
				{props.children}
			</div>

			<div class="sm:max-h-[32rem] h-full order-first rounded-xl border border-[#272831] bg-[#03000A] lg:order-last">
				<div class="landing-section h-full bg-[url('src/pages/db/_assets/tab-illustration-grid.png')] bg-cover bg-no-repeat p-16 lg:p-8 flex">
					{props.illustration}
				</div>
			</div>
		</div>
	)
}
