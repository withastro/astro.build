declare namespace App {
    interface Link {
        href: string;
        text: string;
    }

    interface Image {
        src: string;
        alt: string;
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
        | 'vue';

    interface Theme {
        slug: string;
        title: string;
        description: string;
        image: Image;
        categories: string[];
        tags?: ThemeTag[];
        repoUrl: Link;
        demoUrl?: Link;
        npmUrl?: Link;
    }
}