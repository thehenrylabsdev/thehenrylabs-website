import { z } from 'zod';

export const LabManifestSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.object({
    en: z.string().min(1),
    vi: z.string().min(1),
  }),
  summary: z.object({
    en: z.string().min(1),
    vi: z.string().min(1),
  }),
  tier: z.enum(['inline', 'static-app', 'service']),
  stack: z.array(z.string()),
  topics: z.array(z.string()),
  status: z.enum(['live', 'wip', 'archived']),
  featured: z.boolean().default(false),
  publishedAt: z.string(),
  repo: z.string().url(),
  embed: z.object({
    mode: z.enum(['iframe', 'inline']),
    aspectRatio: z.string().default('16/9'),
    allowFullscreen: z.boolean().default(true),
  }),
  entries: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  headers: z.record(z.string()).optional(),
  seo: z.object({
    keywords: z.array(z.string()).default([]),
  }),
});

export type LabManifest = z.infer<typeof LabManifestSchema>;

export function defineLab(config: LabManifest): LabManifest {
  return LabManifestSchema.parse(config);
}
