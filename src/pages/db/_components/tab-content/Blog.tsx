import TabLayout from "./TabLayout.tsx"

export default function Blog() {
	return (
		<TabLayout
			illustration={
				<div class="landing-section h-full p-16 lg:p-8">
					<img
						class="h-full max-h-[16rem] w-auto"
						src="/assets/db/blog-tab-illustration.png"
						alt="Image illustration of the Blog Use Case with Astro DB"
					/>
				</div>
			}
		>
			<>
				<h3 class="text-lg font-medium text-astro-gray-200">Blog</h3>
				<div class="border-b border-[#272831]"></div>
			</>
		</TabLayout>
	)
}
