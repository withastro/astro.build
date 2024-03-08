import TabLayout from "./TabLayout.tsx"

export default function Auth() {
	return (
		<TabLayout
			illustration={
				<div class="landing-section h-full p-16 lg:p-8">
					<img
						class="h-fit max-h-[24rem] w-auto"
						src="/assets/db/auth-tab-illustration.png"
						alt="Image illustration of the Authentication Use Case with Astro DB"
					/>
				</div>
			}
		>
			<>
				<h3 class="text-lg font-medium text-astro-gray-200">Authentication</h3>
				<div class="border-b border-[#272831]"></div>
			</>
		</TabLayout>
	)
}
