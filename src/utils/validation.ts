export type ValidationRule = {
  pattern: RegExp;
  errorMessage: string;
};

export type ValidationRules = {
  [key: string]: ValidationRule;
};

export const validationRules: ValidationRules = {
  first_name: {
    pattern: /^[A-ZА-ЯЁ][a-zA-Zа-яёA-ZА-ЯЁ-]*$/,
    errorMessage: 'First letter must be capital, only hyphen allowed',
  },
  second_name: {
    pattern: /^[A-ZА-ЯЁ][a-zA-Zа-яёA-ZА-ЯЁ-]*$/,
    errorMessage: 'First letter must be capital, only hyphen allowed',
  },
  login: {
    pattern: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
    errorMessage: '3-20 characters, Latin letters, may contain digits and hyphen/underscore',
  },
  email: {
    pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    errorMessage: 'Enter a valid email address',
  },
  password: {
    pattern: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    errorMessage: '8-40 characters, must contain at least one capital letter and digit',
  },
  message: {
    pattern: /\S+/,
    errorMessage: 'Message cannot be empty',
  },
  oldPassword: {
    pattern: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    errorMessage: '8-40 characters, must contain at least one capital letter and digit',
  },
  newPassword: {
    pattern: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    errorMessage: '8-40 characters, must contain at least one capital letter and digit',
  },
};

export function validateField(name: string, value: string): string | null {
  const rule = validationRules[name];

  if (!rule) {
    return null;
  }

  if (!value || !rule.pattern.test(value)) {
    return rule.errorMessage;
  }

  return null;
}

export function validateForm(formData: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.entries(formData).forEach(([name, value]) => {
    const error = validateField(name, value);
    if (error) {
      errors[name] = error;
    }
  });

  return errors;
}

export function validatePasswordMatch(password: string, confirmPassword: string): string | null {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}
