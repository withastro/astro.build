export type SocialLink = {
	me?: string;
	text: string;
	icon: string;
	href: string;
	platform: string;
	footerOnly?: boolean;
};

export type SiteInfo = {
	name: string;
	title: string;
	description: string;
	image: {
		src: string;
		alt: string;
	};
	socialLinks: SocialLink[];
};

const siteInfo: SiteInfo = {
	name: 'Astro',
	title: 'Build the web you want',
	description:
		'Astro builds fast content sites, powerful web applications, dynamic server APIs, and everything in-between.',
	image: {
		src: '/og/social.jpg',
		alt: 'Build the web you want',
	},
	socialLinks: [
		{
			platform: 'discord',
			href: '/chat',
			icon: 'social/discord',
			text: 'Join the Astro community on Discord',
		},
		{
			platform: 'twitter',
			icon: 'social/twitter',
			me: 'https://x.com/astrodotbuild',
			href: 'https://x.com/astrodotbuild',
			text: 'Follow Astro on x.com (formerly Twitter)',
		},
		{
			platform: 'github',
			icon: 'social/github',
			text: "Go to Astro's GitHub repo",
			me: 'https://github.com/withastro/',
			href: 'https://github.com/withastro/astro',
		},
		{
			platform: 'bluesky',
			footerOnly: true,
			icon: 'social/bluesky',
			me: 'https://bsky.app/profile/astro.build',
			text: 'Follow Astro on Bluesky',
			href: 'https://bsky.app/profile/astro.build',
		},
		{
			platform: 'mastodon',
			footerOnly: true,
			icon: 'social/mastodon',
			me: 'https://m.webtoo.ls/@astro',
			text: 'Follow Astro on Mastodon',
			href: 'https://m.webtoo.ls/@astro',
		},
		{
			platform: 'reddit',
			footerOnly: true,
			icon: 'social/reddit',
			me: 'https://www.reddit.com/r/withastro/',
			text: 'Join the official Astro community on Reddit',
			href: 'https://www.reddit.com/r/withastro/',
		},
	],
};

export default siteInfo;
