export const social = [
    {
        icon: 'mdi:github',
        title: 'Github',
        href: 'https://github.com/withastro/astro'
    },
    {
        icon: 'fa-brands:discord',
        title: 'Discord',
        href: 'https://astro.build/chat'
    },
    {
        icon: 'mdi:twitter',
        title: '@astrodotbuild',
        href: 'https://twitter.com/astrodotbuild'
    },
]

export const navigation = [
    { href: '/themes', title: 'Themes' },
    { href: '/blog', title: 'Blog' },
    { href: 'https://docs.astro.build', title: 'Docs' },
    { href: '/play', title: 'Playground', hiddenMobile: true }
]

export const footer = [
    { href: '/about', title: 'About' },
    { href: '/company', title: "We're Hiring!" },
    { href: '/blog', title: 'Blog' },
    { href: '/press', title: 'Press' }
]

export interface NavigationItem {
    href: string;
    title: string;
    description?: string;
    hiddenMobile?: boolean;
}

export interface NavigationGroup {
    title: string;
    items: NavigationItem[];
}

export type GlobalNavigation = (NavigationItem | NavigationGroup)[];

export const globalNavigation: GlobalNavigation = [
    {
        title: "Build",
        items: [{
            href: "https://docs.astro.build/en/getting-started/",
            title: "Getting Started",
            description: "New to Astro? Start with our docs and online playground."
        }, {
            href: "/themes",
            title: "Themes",
            description: "Start your next Astro project with a prebuilt theme."
        }, {
            href: "/integrations",
            title: "Integrations",
            description: "Try the plugins and components built by our amazing community."
        }]
    },
    {
        title: "Learn",
        items: [{
            href: "https://docs.astro.build",
            title: "Docs",
            description: "Not your first rodeo? Jump into our docs for examples and best practices.",
        }, {
            href: "https://docs.astro.build/en/reference/configuration-reference/",
            title: "API",
            description: "Read more about our API, configuration, built-in components, and more."
        }, {
            href: "/blog",
            title: "Blog",
            description: "The latest Astro news, straight from the team."
        }]
    },
    { href: '/play', title: 'Playground', hiddenMobile: true }
]