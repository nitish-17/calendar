import { z } from 'zod';

export const dbExportSchema = z.object({
  formatName: z.literal('dexie'),
  formatVersion: z.number(),
  data: z.object({
    databaseName: z.string(),
    databaseVersion: z.number(),
    tables: z.array(z.object({
      name: z.string(),
      schema: z.string(),
      data: z.array(z.any())
    }))
  })
});

export type DBExport = z.infer<typeof dbExportSchema>;
