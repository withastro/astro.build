import { defineCollection, z } from "astro:content";
import social from '../assets/social.png';

const blog = defineCollection({
  schema: {
    title: z.string(),
    description: z.string(),
    publishDate: z.string().transform(str => new Date(str)),
    authors: z.array(z.string()),
    socialImage: z.string().optional().default(social.src),
    coverImage: z.string().optional(),
    lang: z.enum(['en']).optional(),
  },
});

export const collections = { blog };