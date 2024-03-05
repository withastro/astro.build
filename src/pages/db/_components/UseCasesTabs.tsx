import { createSignal, Switch, Match, For } from "solid-js"

export default function UseCasesTabs() {
	const [selectedTab, setSelectedTab] = createSignal("Authentication")

	const tabs = [
		{ label: "Authentication", icon: "" },
		{ label: "Forms", icon: "" },
		{ label: "Image Uploads", icon: "" },
		{ label: "E-Commerce", icon: "" },
		{ label: "Blog", icon: "" },
		{ label: "Feedback Widgets", icon: "" },
		{ label: "Comments", icon: "" },
	]

	return (
		<div class="space-y-4">
			<ul class="inline-flex w-full gap-4 border-b border-astro-gray-400">
				<For each={tabs}>
					{({ label, icon }) => (
						<button
							class={
								selectedTab() === label
									? "border-b border-white px-4 py-2 text-white "
									: "border-b border-transparent px-4 py-2 text-astro-gray-300 hover:border-astro-gray-200 hover:text-astro-gray-200"
							}
							onClick={() => setSelectedTab(label)}
						>
							<span>{label}</span>
						</button>
					)}
				</For>
			</ul>

			<Switch>
				<Match when={selectedTab() === "Authentication"}>
					<div>Auth</div>
				</Match>
				<Match when={selectedTab() === "Forms"}>
					<div>Forms</div>
				</Match>
				<Match when={selectedTab() === "Image Uploads"}>
					<div>Image Uploads</div>
				</Match>
                <Match when={selectedTab() === "E-Commerce"}>
					<div>E-Commerce</div>
				</Match>
                <Match when={selectedTab() === "Blog"}>
					<div>Blog</div>
				</Match>
                <Match when={selectedTab() === "Feedback Widgets"}>
					<div>Feedback Widgets</div>
				</Match>
                <Match when={selectedTab() === "Comments"}>
					<div>Comments</div>
				</Match>
			</Switch>

		</div>
	)
}
