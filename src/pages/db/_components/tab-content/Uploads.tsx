import TabLayout from "./TabLayout.jsx"

export default function Uploads() {
	return (
		<TabLayout
			illustration={
				<div class="landing-section h-full p-16 lg:p-8">
					<img
						class="h-fit max-h-[20rem] w-auto"
						src="/assets/db/image-upload-illustration.png"
						alt="Image illustration of the Authentication Use Case with Astro DB"
					/>
				</div>
			}
		>
			<>
				<h3 class="body-large font-medium text-astro-gray-200">Uploads</h3>
				<div class="border-b border-[#272831]"></div>
			</>
		</TabLayout>
	)
}
