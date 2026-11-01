import { z } from 'zod';

export const platformConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'test', 'production']).default('development'),
  port: z.coerce.number().int().positive().default(3000),
  databaseUrl: z.string().min(1),
  databasePoolSize: z.coerce.number().int().positive().default(10),
  sessionSecret: z.string().min(32),
  csrfSecret: z.string().min(32),
  storageDriver: z.enum(['local', 's3']).default('local'),
  storageLocalRoot: z.string().default('./storage'),
});

export type PlatformConfig = z.infer<typeof platformConfigSchema>;

export interface PlatformEnvironment {
  NODE_ENV?: string | undefined;
  PORT?: string | undefined;
  DATABASE_URL?: string | undefined;
  DATABASE_POOL_SIZE?: string | undefined;
  SESSION_SECRET?: string | undefined;
  CSRF_SECRET?: string | undefined;
  STORAGE_DRIVER?: string | undefined;
  STORAGE_LOCAL_ROOT?: string | undefined;
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

export function loadPlatformConfig(env: PlatformEnvironment = process.env): PlatformConfig {
  try {
    return platformConfigSchema.parse({
      nodeEnv: env.NODE_ENV,
      port: env.PORT,
      databaseUrl: env.DATABASE_URL,
      databasePoolSize: env.DATABASE_POOL_SIZE,
      sessionSecret: env.SESSION_SECRET,
      csrfSecret: env.CSRF_SECRET,
      storageDriver: env.STORAGE_DRIVER,
      storageLocalRoot: env.STORAGE_LOCAL_ROOT,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ');
      throw new ConfigError(message);
    }
    throw error;
  }
}
