export const social = [
	{
		icon: 'mdi:github',
		title: 'GitHub',
		href: 'https://github.com/withastro/astro',
	},
	{
		icon: 'fa-brands:discord',
		title: 'Discord',
		href: 'https://astro.build/chat',
	},
	{
		icon: 'mdi:twitter',
		title: 'Twitter',
		href: 'https://twitter.com/astrodotbuild',
	},
]

export const navigation = [
	{ href: '/themes/', title: 'Themes' },
	{ href: '/blog/', title: 'Blog' },
	{ href: 'https://docs.astro.build', title: 'Docs' },
	{ href: '/play/', title: 'Playground', hiddenMobile: true },
]

export const footer = [
	{ href: '/about/', title: 'About' },
	{ href: '/company/', title: "We're Hiring!", external: true },
	{ href: '/blog/', title: 'Blog', hiddenMobile: true },
	{ href: '/press/', title: 'Press' },
]

export interface NavigationItem {
	href: string
	title: string
	description?: string
	hiddenMobile?: boolean
}

export interface NavigationGroup {
	title: string
	items: NavigationItem[]
}

export type GlobalNavigation = (NavigationItem | NavigationGroup)[]

export const globalNavigation: GlobalNavigation = [
	{
		title: 'Explore',
		items: [
			{
				href: '/themes/',
				title: 'Themes',
				description: 'Start your next Astro project with a prebuilt theme.',
			},
			{
				href: '/integrations/',
				title: 'Integrations',
				description:
					'Try the plugins and components built by our amazing community.',
			},
		],
	},
	{
		title: 'Learn',
		items: [
			{
				href: 'https://docs.astro.build',
				title: 'Documentation',
				description:
					'Jump into our docs to learn how to get the most out of Astro.',
			},
			{
				href: '/play/',
				title: 'Playground',
				description:
					'Jump into our online playground to try Astro with zero setup.',
			},
		],
	},
	{
		 href: '/showcase',
		 title: 'Showcase',
		description: 'Looking for inspiration? Explore these awesome sites built with Astro.'
	},
	{
		title: 'Blog',
		href: '/blog/',
	},
]
