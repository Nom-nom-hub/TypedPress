import { z } from 'zod';

export const themeManifestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().optional(),
  templates: z.array(z.string()).default([]),
  designTokens: z.record(z.string(), z.unknown()).default({}),
});

export type ThemeManifest = z.infer<typeof themeManifestSchema>;

export interface ThemeRegistry {
  register(manifest: ThemeManifest): void;
  get(id: string, version?: string): ThemeManifest | undefined;
  list(): readonly ThemeManifest[];
}

export function createThemeRegistry(): ThemeRegistry {
  const themes = new Map<string, ThemeManifest>();

  return {
    register(manifest) {
      const parsed = themeManifestSchema.parse(manifest);
      const key = `${parsed.id}@${parsed.version}`;
      if (themes.has(key)) {
        throw new Error(`Theme is already registered: ${key}`);
      }
      themes.set(key, parsed);
    },
    get(id, version) {
      if (version) {
        return themes.get(`${id}@${version}`);
      }
      return [...themes.values()].find((theme) => theme.id === id);
    },
    list() {
      return [...themes.values()];
    },
  };
}