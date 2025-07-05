import { z, ZodError } from 'zod';
import Constants from 'expo-constants';

interface EnvSchema {
  apiAuth: string;
  apiToken: string;
  clientId: string;
  clientSecret: string;
}

const envSchema = z.object({
  apiAuth: z.string({
    required_error: 'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH é obrigatória e deve ser uma URL válida (Ex. https://api.example.com)',
  }).url({
    message: 'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH é obrigatória e deve ser uma URL válida (Ex. https://api.example.com)',
  }),
  apiToken: z.string({
    required_error: 'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_API_TOKEN é obrigatória (Ex. abc123xyz789)',
  }).min(1, {
    message: 'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_API_TOKEN é obrigatória (Ex. abc123xyz789)',
  }),
  clientId: z.string({
    required_error: 'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_ID é obrigatória (Ex. cd49f429-f2f3-444f-b35d-7997cb35d358)',
  }).min(1, {
    message: 'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_ID é obrigatória (Ex. cd49f429-f2f3-444f-b35d-7997cb35d358)',
  }),
  clientSecret: z.string({
    required_error: 'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_SECRET é obrigatória (Ex. xyz789abc123)',
  }).min(1, {
    message: 'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_SECRET é obrigatória (Ex. xyz789abc123)',
  }),
});

class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvValidationError';
  }
}

const validateEnv = (env: Record<string, string | undefined>): EnvSchema => {
  // Map the input environment variables to the schema's expected keys
  const mappedEnv = {
    apiAuth: env.EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH,
    apiToken: env.EXPO_PUBLIC_CLIENT_APP_TELECOM_API_TOKEN,
    clientId: env.EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_ID,
    clientSecret: env.EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_SECRET,
  };

  const result = envSchema
    .transform((data: EnvSchema): EnvSchema => ({
      apiAuth: data.apiAuth.trim(),
      apiToken: data.apiToken.trim(),
      clientId: data.clientId.trim(),
      clientSecret: data.clientSecret.trim(),
    }))
    .safeParse(mappedEnv);

  if (!result.success) {
    const error: ZodError = result.error;
    const errorMessage: string = error.issues
      .map((issue) => issue.message)
      .join('; ');
    throw new EnvValidationError(errorMessage);
  }

  return Object.freeze(result.data);
};

const rootEnv: EnvSchema = process.env.NODE_ENV !== 'test'
  ? validateEnv({
    EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH: process.env.EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH,
    EXPO_PUBLIC_CLIENT_APP_TELECOM_API_TOKEN: process.env.EXPO_PUBLIC_CLIENT_APP_TELECOM_API_TOKEN,
    EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_ID: process.env.EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_ID,
    EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_SECRET: process.env.EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_SECRET,
  })
  : ({} as EnvSchema);

type EnvConfig = EnvSchema;

export { rootEnv, validateEnv, EnvConfig, EnvValidationError };
