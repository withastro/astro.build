export type SocialLink = {
	me?: string;
	/** Longer descriptive label, e.g. `"Join the Astro community on Discord"` */
	text: string;
	/** Short label with the name of the platform, e.g. `"Discord"`*/
	label: string;
	icon: string;
	href: string;
	/** Platform ID, e.g. `"discord"` */
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
			platform: 'bluesky',
			footerOnly: true,
			icon: 'social/bluesky',
			me: 'https://bsky.app/profile/astro.build',
			label: 'Bluesky',
			text: 'Follow Astro on Bluesky',
			href: 'https://bsky.app/profile/astro.build',
		},
		{
			platform: 'discord',
			footerOnly: true,
			href: '/chat',
			icon: 'social/discord',
			label: 'Discord',
			text: 'Join the Astro community on Discord',
		},
		{
			platform: 'github',
			icon: 'social/github',
			label: 'GitHub',
			text: "Go to Astro's GitHub repo",
			me: 'https://github.com/withastro/',
			href: 'https://github.com/withastro/astro',
		},
		{
			platform: 'mastodon',
			footerOnly: true,
			icon: 'social/mastodon',
			me: 'https://m.webtoo.ls/@astro',
			label: 'Mastodon',
			text: 'Follow Astro on Mastodon',
			href: 'https://m.webtoo.ls/@astro',
		},
		{
			platform: 'reddit',
			footerOnly: true,
			icon: 'social/reddit',
			me: 'https://www.reddit.com/r/withastro/',
			label: 'Reddit',
			text: 'Join the official Astro community on Reddit',
			href: 'https://www.reddit.com/r/withastro/',
		},
		{
			platform: 'twitter',
			footerOnly: true,
			icon: 'social/twitter',
			me: 'https://x.com/astrodotbuild',
			href: 'https://x.com/astrodotbuild',
			label: 'X.com',
			text: 'Follow Astro on x.com (formerly Twitter)',
		},
	],
};

export default siteInfo;
