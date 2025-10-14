export type SocialLink = {
	/** Longer descriptive label, e.g. `"Join the Astro community on Discord"` */
	text: string;
	/** Short label with the name of the platform, e.g. `"Discord"`*/
	label: string;
	/** Icon name for use with `astro-icon`, e.g. `"social/discord"`. */
	icon: string;
	/** URL for our profile on the external platform. */
	href: string;
	/** Platform ID, e.g. `"discord"`. Used for `astro.build/on/PLATFORM` redirects. */
	platform: string;
	/** Whether this platform should be linked in the site header */
	showInHeader?: boolean;
};

type SiteInfo = {
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
			icon: 'social/bluesky',
			label: 'Bluesky',
			text: 'Follow Astro on Bluesky',
			href: 'https://bsky.app/profile/astro.build',
		},
		{
			platform: 'discord',
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
			href: 'https://github.com/withastro/astro',
			showInHeader: true,
		},
		{
			platform: 'linkedin',
			icon: 'social/linkedin',
			label: 'LinkedIn',
			text: 'Follow Astro on LinkedIn',
			href: 'https://www.linkedin.com/company/withastro',
		},
		{
			platform: 'mastodon',
			icon: 'social/mastodon',
			label: 'Mastodon',
			text: 'Follow Astro on Mastodon',
			href: 'https://m.webtoo.ls/@astro',
		},
		{
			platform: 'reddit',
			icon: 'social/reddit',
			label: 'Reddit',
			text: 'Join the official Astro community on Reddit',
			href: 'https://www.reddit.com/r/withastro/',
		},
		{
			platform: 'twitter',
			icon: 'social/twitter',
			href: 'https://x.com/astrodotbuild',
			label: 'X.com',
			text: 'Follow Astro on x.com (formerly Twitter)',
		},
		{
			platform: 'youtube',
			icon: 'social/youtube',
			href: 'https://www.youtube.com/@astrodotbuild',
			label: 'YouTube',
			text: 'Follow Astro on YouTube',
		},
	],
};

export default siteInfo;
