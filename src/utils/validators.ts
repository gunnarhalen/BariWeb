export type RuleName =
  | "required"
  | "email"
  | "cpf"
  | "cnpj"
  | "phone"
  | "cep"
  | "strongPassword";

export type ValidationErrors = Record<string, string>;

export const VALIDATION_MESSAGES: Record<RuleName, string> = {
  required: "Campo obrigatório",
  email: "E-mail inválido",
  cpf: "CPF inválido",
  cnpj: "CNPJ inválido",
  phone: "Telefone inválido",
  cep: "CEP inválido",
  strongPassword:
    "A senha deve ter no mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial",
};

const onlyDigits = (value: string): string => value.replace(/\D/g, "");

const isRepeated = (value: string): boolean =>
  value.length > 0 && /^(\d)\1+$/.test(value);

export const required = (value: string): boolean => value.trim().length > 0;

export const email = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const cpf = (value: string): boolean => {
  const digits = onlyDigits(value);

  if (digits.length !== 11 || isRepeated(digits)) {
    return false;
  }

  const calculateDigit = (slice: string): number => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) {
      sum += Number(slice[i]) * (slice.length + 1 - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigit = calculateDigit(digits.slice(0, 9));
  const secondDigit = calculateDigit(digits.slice(0, 10));

  return digits === `${digits.slice(0, 9)}${firstDigit}${secondDigit}`;
};

export const cnpj = (value: string): boolean => {
  const digits = onlyDigits(value);

  if (digits.length !== 14 || isRepeated(digits)) {
    return false;
  }

  const calculateDigit = (slice: string, weights: number[]): number => {
    const sum = slice
      .split("")
      .reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const firstDigit = calculateDigit(digits.slice(0, 12), firstWeights);
  const secondDigit = calculateDigit(digits.slice(0, 13), secondWeights);

  return digits === `${digits.slice(0, 12)}${firstDigit}${secondDigit}`;
};

export const phone = (value: string): boolean => {
  const digits = onlyDigits(value);
  return (digits.length === 10 || digits.length === 11) && !isRepeated(digits);
};

export const cep = (value: string): boolean => onlyDigits(value).length === 8;

export const strongPassword = (value: string): boolean =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(value);

const validators: Record<RuleName, (value: string) => boolean> = {
  required,
  email,
  cpf,
  cnpj,
  phone,
  cep,
  strongPassword,
};

export const errorMessage = (rule: RuleName): string => VALIDATION_MESSAGES[rule];

export function validate(
  fields: Record<string, string>,
  rules: Record<string, RuleName[]>
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const field of Object.keys(rules)) {
    const value = fields[field] ?? "";
    const fieldRules = rules[field];

    const orderedRules: RuleName[] = fieldRules.includes("required")
      ? ["required", ...fieldRules.filter((rule) => rule !== "required")]
      : fieldRules;

    for (const rule of orderedRules) {
      if (!validators[rule](value)) {
        errors[field] = errorMessage(rule);
        break;
      }
    }
  }

  return errors;
}
