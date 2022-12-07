import type { Site } from '../types.js'
import social from '../assets/social.png'

const site: Site = {
    title: 'Astro',
    description:
        "Pull content from anywhere and serve it fast with Astro's next-gen island architecture. Astro is the web framework that you'll enjoy using.",
    image: social,
    twitterHandle: 'astrodotbuild',
    socialLinks: [
        {
            href: 'https://github.com/withastro/astro',
            me: 'https://github.com/withastro/',
            text: "Go to Astro's GitHub repo",
            pack: 'bi',
            name: 'github'
        },
        {
            href: '/chat',
            text: 'Join the Astro community on Discord',
            pack: 'cib',
            name: 'discord'
        },
        {
            href: 'https://twitter.com/astrodotbuild',
            me: 'https://twitter.com/astrodotbuild',
            text: 'Follow Astro on Twitter',
            pack: 'bi',
            name: 'twitter'
        },
        {
            href: 'https://m.webtoo.ls/@astro',
            me: 'https://m.webtoo.ls/@astro',
            text: 'Follow Astro on Mastodon',
            pack: 'bi',
            name: 'mastodon',
            footerOnly: true
        }
    ]
}

export default site
