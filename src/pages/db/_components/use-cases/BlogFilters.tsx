import { createSignal } from "solid-js"

export default function BlogFilters() {
	const tags = ["all articles", "engineering", "community", "changelog"]

	const posts = [
		{
			id: 1,
			tag: "engineering",
			publishedOn: "March 13, 2024",
			title: "Astro DB: A Deep Dive",
			summary:
				"Astro DB gives you a fully local libSQL database as soon as you start up your dev server. With our background as a static-site generator, it was important that the database could be built...",
		},
		{
			id: 2,
			tag: "community",
			publishedOn: "March 12, 2024",
			title: "The Astro Developer Portal",
			summary:
				"Our aim with the Developer Portal is to provide a centralized platform where theme authors, and eventually integration builders, can have full control over managing their listings in Astro’s...",
		},
	]

	const [filteredPosts, setFilteredPosts] = createSignal(posts)
	const [activeTopic, setActiveTopic] = createSignal(tags[0])

	function handleFilter(tag: string) {
		setActiveTopic(tag)
		if (tag === "all articles") {
			return setFilteredPosts(posts)
		}
		const updatedPosts = posts.filter((post) => post.tag === tag)

		return setFilteredPosts(updatedPosts)
	}

	return (
		<>
			<ul class="flex items-center justify-start gap-2 border-b border-b-astro-gray-600 pb-4 pt-4">
				{tags.map((tag) => (
					<li>
						<button
							type="button"
							onClick={() => handleFilter(tag)}
							class={`
							flex w-fit rounded-full px-3 py-1.5 text-sm capitalize
							${tag === activeTopic() ? "bg-[#222636]/80 text-astro-gray-200" : "bg-transparent hover:bg-[#222636]/50 text-astro-gray-300"}
						`}
						>
							{tag}
						</button>
					</li>
				))}
			</ul>

			{filteredPosts().length > 0 ? 
        <ul id="postsList" class="space-y-4 divide-y divide-astro-gray-600">
				{filteredPosts().map((post) => (
						<li class="space-y-2 pt-4">
							<h4 class="text-lg text-[#9FA5B3]">{post.title}</h4>
							<p class="text-balance text-sm text-[#6E7584]">{post.summary}</p>
							<p class="text-sm text-astro-gray-400">{post.publishedOn}</p>
						</li>
				))}
        </ul>
			 : (
				<p class="mt-4 text-balance text-sm text-[#6E7584]">
					No articles available about this topic
				</p>
			)}
		</>
	)
}
