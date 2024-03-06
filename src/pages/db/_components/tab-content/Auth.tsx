import TabLayout from "./TabLayout.tsx"

export default function Auth() {
	return (
		<TabLayout
			illustration={
				<img
					class="w-auto h-fit"
					src="src/pages/db/_assets/auth-tab-illustration.png"
					alt="Image illustration of the Authentication Use Case with Astro DB"
				/>
			}
		>
			<>
				<h3 class="text-lg text-astro-gray-200 font-medium">Authentication</h3>
				<div class="border-b border-[#272831]"></div>
			</>
		</TabLayout>
	)
}
