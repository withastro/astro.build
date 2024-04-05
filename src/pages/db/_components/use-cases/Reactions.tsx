import { createSignal } from "solid-js"

export default function Reactions() {
	const [selected, setSelected] = createSignal(false)
	const [reactions, setReactions] = createSignal([
		{ id: 1, emoji: "🔥", count: 1121, isClicked: false },
		{ id: 2, emoji: "👍", count: 459, isClicked: false },
		{ id: 3, emoji: "👎", count: 391, isClicked: false },
		{ id: 4, emoji: "🚀", count: 275, isClicked: false },
		{ id: 5, emoji: "🎉", count: 137, isClicked: false }
	])

	function handleReactionClick(id: number) {
		const updatedReactions = reactions().map((reaction) => {
			if(selected() === true && reaction.id === id){
				setSelected(false)
				return { ...reaction, count: reaction.count - 1, isClicked: false }
			}
			
			if (reaction.id === id) {
				setSelected(true)
				return { ...reaction, count: reaction.count + 1, isClicked: true }
			}
			return reaction
		})
		setReactions(updatedReactions)
	}

	return (
		<div class="mt-4 flex items-center justify-start gap-4 text-astro-gray-300">
			{reactions().map((reaction) => (
				<button
					type="button"
					aria-selected={selected() && reaction.isClicked}
					onClick={() => handleReactionClick(reaction.id)}
					class="flex w-fit rounded-full bg-[#222636]/80 px-3 py-1.5 tabular-nums hover:bg-[#222636]/50 aria-selected:bg-[#32384F] aria-selected:text-astro-gray-100"
				>
					{`${reaction.emoji} ${reaction.count}`}
				</button>
			))}
		</div>
	)
}
