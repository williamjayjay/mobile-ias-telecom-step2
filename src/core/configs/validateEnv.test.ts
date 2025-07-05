import { EnvValidationError, validateEnv } from './env.config';

describe('validateEnv', () => {
  const validEnv: Record<string, string> = {
    EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH: 'https://api.example.com',
    EXPO_PUBLIC_CLIENT_APP_TELECOM_API_TOKEN: 'abc123xyz789',
    EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_ID: 'cd49f429-f2f3-444f-b35d-7997cb35d358',
    EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_SECRET: 'xyz789abc123',
  };

  it('should validate and transform valid environment variables', () => {
    const result = validateEnv(validEnv);

    expect(result).toEqual({
      apiAuth: 'https://api.example.com',
      apiToken: 'abc123xyz789',
      clientId: 'cd49f429-f2f3-444f-b35d-7997cb35d358',
      clientSecret: 'xyz789abc123',
    });
    expect(Object.isFrozen(result)).toBe(true);
  });

  it('should trim whitespace from valid environment variables', () => {
    const envWithWhitespace = {
      EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH: '  https://api.example.com  ',
      EXPO_PUBLIC_CLIENT_APP_TELECOM_API_TOKEN: '  abc123xyz789  ',
      EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_ID: '  cd49f429-f2f3-444f-b35d-7997cb35d358  ',
      EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_SECRET: '  xyz789abc123  ',
    };

    const result = validateEnv(envWithWhitespace);

    expect(result).toEqual({
      apiAuth: 'https://api.example.com',
      apiToken: 'abc123xyz789',
      clientId: 'cd49f429-f2f3-444f-b35d-7997cb35d358',
      clientSecret: 'xyz789abc123',
    });
  });
  it('should throw EnvValidationError for missing apiAuth', () => {
    const invalidEnv = { ...validEnv, EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH: undefined };

    expect(() => validateEnv(invalidEnv)).toThrow(EnvValidationError);
    expect(() => validateEnv(invalidEnv)).toThrow(
      'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH é obrigatória e deve ser uma URL válida (Ex. https://api.example.com)'
    );
  });

  it('should throw EnvValidationError when apiAuth is empty string', () => {
    const invalidEnv = { ...validEnv, EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH: '' };

    expect(() => validateEnv(invalidEnv)).toThrow(EnvValidationError);
    expect(() => validateEnv(invalidEnv)).toThrow(
      'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH é obrigatória e deve ser uma URL válida (Ex. https://api.example.com)'
    );
  });

  it('should throw EnvValidationError for invalid apiAuth URL', () => {
    const invalidEnv = { ...validEnv, EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH: 'not-a-url' };

    expect(() => validateEnv(invalidEnv)).toThrow(EnvValidationError);
    expect(() => validateEnv(invalidEnv)).toThrow(
      'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH é obrigatória e deve ser uma URL válida (Ex. https://api.example.com)'
    );
  });

  it('should throw EnvValidationError for empty apiToken', () => {
    const invalidEnv = { ...validEnv, EXPO_PUBLIC_CLIENT_APP_TELECOM_API_TOKEN: '' };

    expect(() => validateEnv(invalidEnv)).toThrow(EnvValidationError);
    expect(() => validateEnv(invalidEnv)).toThrow(
      'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_API_TOKEN é obrigatória (Ex. abc123xyz789)'
    );
  });

  it('should throw EnvValidationError for missing clientId', () => {
    const invalidEnv = { ...validEnv, EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_ID: undefined };

    expect(() => validateEnv(invalidEnv)).toThrow(EnvValidationError);

    expect(() => validateEnv(invalidEnv)).toThrow(
      'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_ID é obrigatória (Ex. cd49f429-f2f3-444f-b35d-7997cb35d358)'
    );

  });

  it('should throw EnvValidationError for empty clientSecret', () => {
    const invalidEnv = { ...validEnv, EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_SECRET: '' };

    expect(() => validateEnv(invalidEnv)).toThrow(EnvValidationError);
    expect(() => validateEnv(invalidEnv)).toThrow(
      'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_SECRET é obrigatória (Ex. xyz789abc123)'
    );
  });

  it('should throw EnvValidationError with multiple error messages', () => {
    const invalidEnv = {
      EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH: 'not-a-url',
      EXPO_PUBLIC_CLIENT_APP_TELECOM_API_TOKEN: '',
      EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_ID: '',
      EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_SECRET: '',
    };

    expect(() => validateEnv(invalidEnv)).toThrow(EnvValidationError);
    expect(() => validateEnv(invalidEnv)).toThrow(
      'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_API_AUTH é obrigatória e deve ser uma URL válida (Ex. https://api.example.com); ' +
      'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_API_TOKEN é obrigatória (Ex. abc123xyz789); ' +
      'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_ID é obrigatória (Ex. cd49f429-f2f3-444f-b35d-7997cb35d358); ' +
      'A variável EXPO_PUBLIC_CLIENT_APP_TELECOM_CLIENT_SECRET é obrigatória (Ex. xyz789abc123)'
    );
  });
});
