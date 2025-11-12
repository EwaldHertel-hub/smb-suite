import { EnvVars } from '../types/env';

export default () => {
  const env = process.env as unknown as Record<keyof EnvVars, string>;

  return {
    nodeEnv: env.NODE_ENV ?? 'development',
    port: Number(env.PORT ?? 3001),
    databaseUrl: env.DATABASE_URL,
    jwtSecret: env.JWT_SECRET,
    redisUrl: env.REDIS_URL,
    email: {
      host: env.EMAIL_SMTP_HOST,
      port: Number(env.EMAIL_SMTP_PORT ?? 1025),
      from: env.EMAIL_FROM
    }
  };
};