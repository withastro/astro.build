export type ThemeAndAuthor = {
	Theme: Theme;
	Author: Author;
};

export type Theme = {
	id: number;
	slug: string;
	title: string;
	featured: boolean;
	description: string;
	fullDescription: string;
	body: string;
	image: string;
	images: Array<string>; // array of strings with URL's
	authorId: number;
	repoUrl?: string;
	demoUrl?: string;
	buyUrl?: string;
	links: Array<string>; // array of strings with URL's
	paid: boolean;
	stars: number;
	publishDate: Date;
	updatedAt?: Date;
	approved: boolean;
	denied: boolean;
	hidden: boolean;
	price: number;
	sellingThroughPortal: boolean;
	stripeProductId?: string;
	stripePriceId?: string;
};

export type ThemeHasCategory = {
	themeId: number;
	categoryId: number;
};

export type ThemeHasTool = {
	themeId: number;
	toolId: number;
};

export type Author = {
	id: number;
	url?: string;
	name: string;
	email?: string;
	avatar?: string;
	role: string;
	githubId: number;
	username: string;
	updatedAt: Date;
	createdAt: Date;
};

export type ThemeCategory = {
	id: number;
	value: string;
	name: string;
};

export type ThemeTool = {
	id: number;
	value: string;
	name: string;
};
