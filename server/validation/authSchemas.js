import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const ajv = new Ajv({ allErrors: true, strict: false, $data: true});
addFormats(ajv);

const loginSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 3 },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

const registerSchema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 3, maxLength: 30, pattern: "^[a-zA-Z0-9_]+$" },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 3 },
    confirmPassword: { type: "string" },
  },
  required: ["username", "email", "password", "confirmPassword"],
  additionalProperties: false,

  if: {
    properties: { password: { type: "string" } }
  },
  then: {
    properties: {
      confirmPassword: {
        const: { $data: "1/password" },
        errorMessage: "паролі не співпадають" 
      }
    }
  }
};
const validateLogin = ajv.compile(loginSchema);
const validateRegister = ajv.compile(registerSchema);

export { validateLogin, validateRegister };