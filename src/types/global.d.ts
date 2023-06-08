declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      ACCESS_TOKEN_SECRET: string;
      ACCESS_TOKEN_EXP: string;
      REFRESH_TOKEN_SECRET: string;
      REFRESH_TOKEN_EXP: string;
      COOKIE_SECRET: string;
      COOKIE_EXP: string;
      WEB_ADMIN_URL?: string;
      WEB_PARTNER_URL?: string;
      MONGO_URI: string;
      PORT: number;
    }
  }
}
