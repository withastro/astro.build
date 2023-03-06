export type SocialLink = {
	platform: string
	href: string
	me?: string
	text: string
	footerOnly?: boolean
}

export type SiteInfo = {
	name: string
	title: string
	description: string
	image: {
		src: string
		alt: string
	}
	socialLinks: SocialLink[]
}

const siteInfo: SiteInfo = {
	name: "Astro",
	title: "Build the web you want",
	description:
		"Astro is an all-in-one framework for building fast websites faster. Grab content from anywhere, deploy everywhere, and show the web what you've got.",
	image: {
		src: "/og/social.jpg",
		alt: "Build the web you want",
	},
	socialLinks: [
		{
			platform: "github",
			href: "https://github.com/withastro/astro",
			me: "https://github.com/withastro/",
			text: "Go to Astro's GitHub repo",
		},
		{
			platform: "discord",
			href: "/chat",
			text: "Join the Astro community on Discord",
		},
		{
			platform: "twitter",
			href: "https://twitter.com/astrodotbuild",
			me: "https://twitter.com/astrodotbuild",
			text: "Follow Astro on Twitter",
		},
		{
			platform: "mastodon",
			href: "https://m.webtoo.ls/@astro",
			me: "https://m.webtoo.ls/@astro",
			text: "Follow Astro on Mastodon",
			footerOnly: true,
		},
	],
}

export default siteInfo
