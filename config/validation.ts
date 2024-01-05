import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid(
    'development',
    'production',
    'test',
    'provision',
  ),
  JWT_SECRET_KEY: Joi.string().required(),
  PORT: Joi.number().default(5300),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_DATABASE: Joi.string().required(),
  ORIGIN_URL: Joi.string().required(),
  GMAIL_PASS: Joi.string().required(),
  GMAIL_CLIENT: Joi.string().required(),
  GMAIL_SECRET: Joi.string().required(),
  GMAIL_REFRESH_TOKEN: Joi.string().required(),
  GMAIL_ACCESS_TOKEN: Joi.string().required(),
  MSAL_CLIENT_ID: Joi.string().required(),
  MSAL_AUTHORITY_URL: Joi.string().required(),
  MSAL_TENANT_ID: Joi.string().required(),
  MSAL_AUTHENTICATION_MODE: Joi.string().required(),
  MSAL_SCOPE_BASE: Joi.string().required(),
  MSAL_CLIENT_SECRET: Joi.optional(),
  PBI_USERNAME: Joi.string().required(),
  PBI_PASSWORD: Joi.string().required(),
  PBI_WORKSPACE_ID: Joi.string().required(),
  PBI_REPORT_ID: Joi.string().required(),
  PBI_API_URL: Joi.string().required(),
});
