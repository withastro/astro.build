import TabLayout from "./TabLayout.jsx"

export default function Uploads() {
	return (
		<TabLayout
			illustration={
				<img
					class="w-auto h-fit"
					src="src/pages/db/_assets/image-upload-illustration.png"
					alt="Image illustration of the Authentication Use Case with Astro DB"
				/>
			}
		>
			<>
				<h3 class="text-lg text-astro-gray-200 font-medium">Uploads</h3>
				<div class="border-b border-[#272831]"></div>
			</>
		</TabLayout>
	)
}
