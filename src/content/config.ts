import { defineCollection, z } from "astro:content";
import social from '../assets/social.png';

const validAuthors = Object.keys(import.meta.glob('../data/authors/*.json'))
  .map(key => key.replace('../data/authors/', '').replace('.json', '')) as [string, ...string[]];

const blog = defineCollection({
  schema: {
    title: z.string(),
    description: z.string(),
    publishDate: z.string().transform(str => new Date(str)),
    authors: z.array(z.enum(validAuthors)),
    socialImage: z.string().default(social.src),
    coverImage: z.string().optional(),
    lang: z.enum(['en']).default('en'),
  },
});

export const collections = { blog };
