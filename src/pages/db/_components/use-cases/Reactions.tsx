import { createSignal } from "solid-js"

export default function Reactions() {
	const [reactions, setReactions] = createSignal([
		{ id: 1, emoji: "🔥", count: 1121 },
		{ id: 2, emoji: "👍", count: 459 },
		{ id: 3, emoji: "👎", count: 391 },
		{ id: 4, emoji: "🚀", count: 275 },
		{ id: 5, emoji: "🎉", count: 137 },
	])

	function handleReactionClick(id: number) {
		const updatedReactions = reactions().map((reaction) => {
			if (reaction.id === id) {
				return { ...reaction, count: reaction.count + 1 }
			}
			return reaction
		})
		setReactions(updatedReactions)
	}

	return (
		<div class="mt-4 flex items-center justify-start gap-4 text-astro-gray-300">
			{reactions().map((reaction) => (
				<button
					onClick={() => handleReactionClick(reaction.id)}
					class="flex w-fit rounded-full bg-[#222636]/80 px-3 py-1.5 hover:bg-[#222636]/50"
				>
					{`${reaction.emoji} ${reaction.count}`}
				</button>
			))}
		</div>
	)
}
