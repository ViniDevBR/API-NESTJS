/* eslint-disable prettier/prettier */
export const ENV = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV as 'development' | 'test' | 'production',
  LOG_INFO_PATH: process.env.LOG_INFO_PATH,
  LOG_ERROR_PATH: process.env.LOG_ERROR_PATH,
  LOG_DEBUG_PATH: process.env.LOG_DEBUG_PATH,
};
