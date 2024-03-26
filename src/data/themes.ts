import { z } from "zod";

export const themeSchema = z.object({
	Theme: z.object({
		title: z.string(),
		description: z.string(),
		body: z.string(),
		image: z.string(),
		images: z.array(z.string()),
		paid: z.boolean().optional(),
		repoUrl: z.string().optional(),
		buyUrl: z.string().optional(),
		demoUrl: z.string().optional(),
		stars: z.number().optional(),
	}),
	Author: z.object({
		url: z.string(),
	}),
});

export type Theme = z.output<typeof themeSchema>;
