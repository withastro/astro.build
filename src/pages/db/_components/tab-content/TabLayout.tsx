import type { JSX } from "solid-js"

type Props = {
	children: JSX.Element
	illustration: JSX.Element
}

export default function TabLayout(props: Props) {
	return (
		<div class=" grid grid-cols-1 gap-2 lg:grid-cols-3">
			<div class="lg:min-h-[560px] px-6 py-3 lg:col-span-2 space-y-2 rounded-xl border border-[#272831] bg-[#03000A]">
				{props.children}
			</div>

			<div class="lg:min-h-[560px] order-first lg:order-last rounded-xl border border-[#272831] bg-[#03000A]">
                <div class="p-16 lg:p-8 h-full landing-section bg-[url('src/pages/db/_assets/tab-illustration-grid.png')] bg-cover bg-no-repeat">
				{props.illustration}

                </div>
			</div>
		</div>
	)
}
