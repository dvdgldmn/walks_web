type EnvRecord = Record<string, string | undefined>;

const PLACEHOLDER_VALUES = new Set([
  'change-me',
  'change-this-access-secret',
  'change-this-refresh-secret',
  'admin12345',
]);

function requireValue(config: EnvRecord, key: string) {
  const value = config[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function validateEnv(config: EnvRecord) {
  requireValue(config, 'DATABASE_URL');
  requireValue(config, 'JWT_ACCESS_SECRET');
  requireValue(config, 'JWT_REFRESH_SECRET');
  requireValue(config, 'ADMIN_EMAIL');
  requireValue(config, 'ADMIN_PASSWORD');

  if ((config.NODE_ENV || '').toLowerCase() === 'production') {
    const productionKeys = [
      'POSTGRES_PASSWORD',
      'JWT_ACCESS_SECRET',
      'JWT_REFRESH_SECRET',
      'ADMIN_PASSWORD',
    ] as const;

    for (const key of productionKeys) {
      const value = config[key]?.trim();
      if (value && PLACEHOLDER_VALUES.has(value)) {
        throw new Error(`Unsafe production secret configured for ${key}`);
      }
    }
  }

  return config;
}
