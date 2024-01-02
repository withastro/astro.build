import clsx from "clsx"
import { createEffect, createSignal, For } from "solid-js"
import Collapse from "~/components/Collapse.jsx"
import { positiveMod } from "~/helpers/math.js"
import agenciesImage from "../_assets/example-agencies.png"
import blogsImage from "../_assets/example-blogs.png"
import eCommerceImage from "../_assets/example-e-commerce.webp"
import marketingImage from "../_assets/example-marketing.webp"
import portfolioImage from "../_assets/example-portfolio.webp"

type Item = {
	title: string
	description: string
	liveUrl: URL
	image: ImageMetadata
	cta: {
		text: string
		href: string
	}
}

const items: Item[] = [
	{
		title: "Blogs",
		description:
			"Build personal and professional blogs with Astro's built-in Markdown support and content APIs.",
		liveUrl: new URL("https://firebase.blog/"),
		image: blogsImage,
		cta: {
			text: "Blog themes",
			href: "/themes/?categories%5B%5D=blog",
		},
	},
	{
		title: "Marketing",
		description: "Stand out from the crowd with a lightning fast site that ranks higher in SEO.",
		liveUrl: new URL("https://rokt.com/"),
		image: marketingImage,
		cta: {
			text: "Marketing themes",
			href: "/themes/?categories%5B%5D=landing-page",
		},
	},
	{
		title: "Agencies",
		description:
			"Agencies use Astro to build fast websites, faster. Customize every site with full control over your frontend code.",
		liveUrl: new URL("https://www.thinkmill.com.au/"),
		image: agenciesImage,
		cta: {
			text: "Agency themes",
			href: "/themes/?categories%5B%5D=landing-page",
		},
	},
	{
		title: "E-Commerce",
		description:
			"Time is money. Give your customers a better shopping experience and grow your business faster.",
		liveUrl: new URL("https://happyplates.com/"),
		image: eCommerceImage,
		cta: {
			text: "E-Commerce themes",
			href: "/themes/?categories%5B%5D=ecommerce",
		},
	},
	{
		title: "Portfolios",
		description:
			"Put your best foot forward with a portfolio that performs. Help people get to know you (and your work) faster.",
		liveUrl: new URL("https://baldbeardedbuilder.com/"),
		image: portfolioImage,
		cta: {
			text: "Portfolio themes",
			href: "/themes/?categories%5B%5D=portfolio",
		},
	},
]

const titleHeight = 32

const [current, setCurrent] = createSignal<number | undefined>(0)

export default function ExampleShowcase() {
	return (
		<div class="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 md:flex-row md:items-center md:px-0">
			<section aria-label="Examples" class="mb-4 grid gap-4 md:mx-auto md:w-[380px]">
				<For each={items}>
					{(item, index) => {
						const [open, setOpen] = createSignal(current() == index())

						const details = (
							<details
								class="group panel p-4 text-left"
								open={index() === 0}
								onClick={(event) => {
									if (event.target.localName === "a") return
									event.preventDefault()
									setCurrent(index())
								}}
							>
								<summary class="accordion heading-4 flex w-full cursor-pointer select-none items-center justify-between">
									<span>{item.title}</span>
									<div
										aria-hidden="true"
										class="leading-none after:content-['+'] group-open:after:content-['-']"
									></div>
								</summary>

								<Collapse
									isOpen={open()}
									onTransitionEnd={() => {
										if (details.open && !open()) {
											details.open = false
										}
									}}
								>
									<p class="body my-4 text-gray-200">{item.description}</p>
									<p class="flex justify-between">
										<a href={item.cta.href} class="link-underline">
											{item.cta.text}
										</a>
										<a href={item.liveUrl.href} class="link-underline">
											See it in the wild
										</a>
									</p>
								</Collapse>
							</details>
						) as HTMLDetailsElement

						createEffect(() => {
							if (current() === index()) {
								setOpen(true)
								details.open = true
							} else {
								setOpen(false)
							}
						})

						return details
					}}
				</For>
			</section>

			<section
				aria-label="Example Previews"
				style={{ "padding-bottom": `calc(${titleHeight}px * ${items.length - 1})` }}
				class="relative md:w-1/2"
			>
				<For each={items}>
					{(item, index) => (
						<a
							tabIndex={-1} // there are already links to the examples on the collapses
							href={item.liveUrl.href}
							target="_blank"
							style={{
								"--position": positiveMod(index() - (current() ?? 0), items.length),
								"--translate": `calc(var(--position) * ${titleHeight}px)`,
								"z-index": `calc(${items.length} - var(--position))`,
							}}
							class={clsx(
								"panel left-0 top-0 block w-full",
								"translate-y-[var(--translate)] transition-transform md:translate-x-[var(--translate)]",
								index() === current() ? "relative" : "absolute",
							)}
							data-card
						>
							<p class="code flex items-center justify-center py-1 text-sm" aria-hidden="true">
								{item.liveUrl.hostname}
							</p>
							<img
								src={item.image.src}
								width={item.image.width}
								height={item.image.height}
								alt={`Example image for ${item.title}`}
								class="w-full object-cover object-left-top"
								loading="lazy"
								decoding="async"
							/>
						</a>
					)}
				</For>
			</section>
		</div>
	)
}
