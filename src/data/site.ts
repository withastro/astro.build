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
            text: 'Follow Astro on Twitter',
            pack: 'bi',
            name: 'twitter'
        }
    ]
}

export default site
