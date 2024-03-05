import type { JSX } from "solid-js"
import { createSignal, For, Match, Switch } from "solid-js"

import AuthIcon from "./icons/AuthIcon.tsx"
import BlogIcon from "./icons/BlogIcon.tsx"
import CommentsIcon from "./icons/CommentsIcon.tsx"
import EcommerceIcon from "./icons/EcommerceIcon.tsx"
import FeedbackIcon from "./icons/FeedbackIcon.tsx"
import FormsIcon from "./icons/FormsIcon.tsx"
import ImageUploadIcon from "./icons/ImageUploadIcon.tsx"

type Tab = {
	label: string
	icon: JSX.Element
}

export default function UseCasesTabs() {
	const [selectedTab, setSelectedTab] = createSignal("Authentication")

	const tabs: Tab[] = [
		{ label: "Authentication", icon: <AuthIcon class="size-6" /> },
		{ label: "Forms", icon: <FormsIcon class="size-6" /> },
		{ label: "Image Uploads", icon: <ImageUploadIcon class="size-6" /> },
		{ label: "E-Commerce", icon: <EcommerceIcon class="size-6" /> },
		{ label: "Blog", icon: <BlogIcon class="size-6" /> },
		{ label: "Feedback Widgets", icon: <FeedbackIcon class="size-6" /> },
		{ label: "Comments", icon: <CommentsIcon class="size-6" /> },
	]

	return (
		<div class="w-full space-y-4">
			<ul class="no-scrollbar inline-flex w-full gap-4 overflow-x-auto whitespace-nowrap border-b border-astro-gray-400">
				<For each={tabs}>
					{({ label, icon }) => (
						<button
							class={
								selectedTab() === label
									? "flex w-full items-center gap-2 border-b border-white px-4 py-2 text-white "
									: "flex w-full items-center gap-2 border-b border-transparent px-4 py-2 text-astro-gray-300 hover:border-astro-gray-200 hover:text-astro-gray-200"
							}
							onClick={() => setSelectedTab(label)}
						>
							{icon} <span>{label}</span>
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
