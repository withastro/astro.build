declare namespace App {
	interface Link {
		href: string
		text: string
	}

	interface Image {
		src: string
		alt: string
	}

	type ThemeTag =
		| 'js'
		| 'scss'
		| 'tailwind'
		| 'lit'
		| 'preact'
		| 'react'
		| 'solid'
		| 'svelte'
		| 'vue'

	interface Theme {
		slug: string
		title: string
		description: string
		image: Image
		categories: string[]
		tags?: ThemeTag[]
		repoUrl: Link
		demoUrl?: Link
		npmUrl?: Link
		official?: boolean
		stars: number
	}

	interface Integration {
		slug: string
		title: string
		description: string
		image?: Image
		categories: string[]
		repoUrl: Link
		npmUrl: Link
		url?: Link
		official?: Boolean
		downloads: number
		featured?: number
		badges: string[]
	}

	interface ShowcaseSite {
		slug: string
		title: string
		image: Image
		categories?: string[]
		url: Link
		featured?: number
		highlight?: boolean
	}
}
