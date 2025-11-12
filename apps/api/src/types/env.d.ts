export interface EnvVars {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  REDIS_URL: string;
  EMAIL_SMTP_HOST: string;
  EMAIL_SMTP_PORT: number | string;
  EMAIL_FROM: string;
}