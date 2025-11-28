import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Схема для логіну
const loginSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 3 },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

// Схема для реєстрації
const registerSchema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 3, maxLength: 30, pattern: "^[a-zA-Z0-9_]+$" }, /// мінімальна довжина 3 чисто для зручності тесту, потім зроблю нормальні обмеження на пароль, коли вже в продакшн піде
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 3 },
    confirmPassword: { type: "string" }, 
  },
  required: ["username", "email", "password", "confirmPassword"],
  additionalProperties: false,
};

const validateLogin = ajv.compile(loginSchema);
const validateRegister = ajv.compile(registerSchema);

export { validateLogin, validateRegister };