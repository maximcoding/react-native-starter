import { z } from 'zod'

export const HnHitSchema = z.object({
  objectID: z.string(),
  title: z.string().nullable(),
  url: z.string().nullable().optional(),
  points: z.number().nullable().optional(),
  num_comments: z.number().nullable().optional(),
  author: z.string().nullable().optional(),
  created_at_i: z.number(),
})

export const HnSearchResponseSchema = z.object({
  hits: z.array(HnHitSchema),
})

export type HnHit = z.infer<typeof HnHitSchema>
