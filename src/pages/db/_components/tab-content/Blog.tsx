import TabLayout from "./TabLayout.tsx"

export default function Blog() {
	return (
		<TabLayout
			illustration={
				<img
					class="h-fit w-auto"
					src="src/pages/db/_assets/blog-tab-illustration.png"
					alt="Image illustration of the Blog Use Case with Astro DB"
				/>
			}
		>
			<>
				<h3 class="text-lg font-medium text-astro-gray-200">Blog</h3>
				<div class="border-b border-[#272831]"></div>
			</>
		</TabLayout>
	)
}
