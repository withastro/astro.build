import type { JSX } from "solid-js"
import { For, createEffect, createSignal } from "solid-js"

import AuthIcon from "./icons/AuthIcon.tsx"
import BlogIcon from "./icons/BlogIcon.tsx"
import CommentsIcon from "./icons/CommentsIcon.tsx"
import EcommerceIcon from "./icons/EcommerceIcon.tsx"
import FeedbackIcon from "./icons/FeedbackIcon.tsx"
import FormsIcon from "./icons/FormsIcon.tsx"
import ImageUploadIcon from "./icons/ImageUploadIcon.tsx"

type Tab = {
	id: string
	label: string
	icon: JSX.Element
	content: JSX.Element
}

const tabs: Tab[] = [
	{ id: 'forms', label: "Forms", icon: <FormsIcon aria-hidden class="w-4" />, content: <><p>Forms</p></> },
	{ id: 'feedback', label: "Feedback", icon: <FeedbackIcon aria-hidden class="w-4" />, content: <><p>Feedback</p></> },
	{ id: 'comments', label: "Comments", icon: <CommentsIcon aria-hidden class="w-4" />, content: <><p>Comments</p></> },
	{ id: 'blog', label: "Blog", icon: <BlogIcon aria-hidden class="w-4" />, content: <><p>Blog</p></> },
	{ id: 'auth', label: "Authentication", icon: <AuthIcon aria-hidden class="w-4" />, content: <><p>Authentication</p></> },
	{ id: 'ecomm', label: "E-commerce", icon: <EcommerceIcon aria-hidden class="w-4" />, content: <><p>E-commerce</p></> },
	{ id: 'media', label: "Uploads", icon: <ImageUploadIcon aria-hidden class="w-4" />, content: <><p>Uploads</p></> },
]

function UseCasesTabPanel(props: { tab: Tab }) {
	return (
		<div id="usecases-tabpanel" role="tabpanel" aria-labelledby={`usecases-tabpanel-${props.tab.id}`}>
				<div id={`usecase-tabpanel-${props.tab.id}`} role="tabpanel" aria-labelledby={`usecase-tab-${props.tab.id}`}>
					{props.tab.content}
				</div>
			</div>	
	)
}

export default function UseCasesTabs() {
	const [currentIndex, setCurrentIndex] = createSignal(0);
	function next() {
		setCurrentIndex(i => i === tabs.length - 1 ? 0 : i + 1);
	}
	function prev() {
		setCurrentIndex(i => i === 0 ? tabs.length - 1 : i - 1);
	}
	const currentTab = () => tabs[currentIndex()];
	const [focusVisible, setFocusVisible] = createSignal(false);

	createEffect(() => {
		const tab = tabs[currentIndex()];
		const el = document.querySelector(`#usecase-tab-${tab.id}`) as HTMLButtonElement;
		el.focus();
	})

	function handleKeyDown(event: KeyboardEvent) {
		if (!focusVisible()) return;
		switch (event.key) {
			case 'ArrowRight': return next();
			case 'ArrowLeft': return prev();
		}
		console.log(event.key);
	}

	createEffect(() => {

	})

	return (
		<div class="w-full space-y-4" onfocusin={() => setFocusVisible(true)} onfocusout={() => setFocusVisible(false)} onKeyDown={handleKeyDown}>
			<ul class="no-scrollbar inline-flex w-full gap-2 overflow-x-auto whitespace-nowrap border-b border-astro-gray-400" role="tablist" aria-labelledby="use-cases">
				<For each={tabs}>
					{(tab, index) => {
						const active = () => currentIndex() === index();

						const tabindex = () => {
							if (focusVisible()) return 0;
							return active() ? 0 : -1;
						}
						return (
							<button
								role="tab"
								aria-selected={active()}
								id={`usecase-tab-${tab.id}`}
								aria-controls={`usecase-tabpanel-${tab.id}`}
								class={[
									"flex items-center gap-2 -mx-2 border-b px-4 py-2 text-astro-gray-300 hover:border-astro-gray-200 hover:text-astro-gray-200 focus:border-white focus:text-white focus:outline-none focus-visible:bg-gray-900",
									active() ? 'text-white' : 'border-transparent'
								].join(' ')}
								tabindex={tabindex()}
								onClick={() => setCurrentIndex(index())}
							>
								{tab.icon} <span>{tab.label}</span>
							</button>
						)
					}}
				</For>
			</ul>

			<UseCasesTabPanel tab={currentTab()} />
		</div>
	)
}


