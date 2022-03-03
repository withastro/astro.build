declare namespace App {
    interface Link {
        href: string;
        text: string;
    }

    interface Image {
        src: string;
        alt: string;
    }

    interface Theme {
        slug: string;
        title: string;
        description: string;
        image: Image;
        categories: string[];
        tags?: string[];
        repoUrl: Link;
        demoUrl?: Link;
        npmUrl?: Link;
    }
}