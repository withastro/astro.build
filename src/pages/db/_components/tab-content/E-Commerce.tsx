import TabLayout from "./TabLayout.tsx"

export default function Ecommerce() {
	return (
		<TabLayout
			illustration={
				<div class="landing-section h-full p-16 lg:p-8">
					<img
						class="h-fit max-h-[32rem] w-auto"
						src="/assets/db/e-commerce-tab-illustration.png"
						alt="Image illustration of the Authentication Use Case with Astro DB"
					/>
				</div>
			}
		>
			<>
				<h3 class="text-lg font-medium text-astro-gray-200">E-Commerce</h3>
				<div class="border-b border-[#272831]"></div>
			</>
		</TabLayout>
	)
}
