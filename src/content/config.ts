import { defineCollection, z } from 'astro:content';

/**
 * Content Collections Configuration
 * Defines the schema for courses and other content types
 */

const coursesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    currency: z.string().default('USD'),
    duration: z.string(),
    paymentLink: z.string().url(),
    image: z.string(),
    published: z.boolean().default(true),
    order: z.number().default(0),
    features: z.array(z.string()).optional(),
    testimonials: z.array(z.string()).optional(),
  }),
});

export const collections = {
  courses: coursesCollection,
};
