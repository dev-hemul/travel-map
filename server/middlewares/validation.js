import { validateLogin, validateRegister } from './../validation/authSchemas.js';

const formatErrors = (errors) => {
  const fieldNames = {
    email: 'Електронна пошта',
    password: 'Пароль',
    username: "Ім'я користувача",
    confirmPassword: 'Підтвердження пароля',
  };
/// тут трошки танці з бубном 
  const seen = new Set(); // прибрати дубль повідомлення про неспівпадаючі паролі

  const result = errors
    .map(err => {
      let field = err.instancePath.slice(1) || err.params.missingProperty || '';
      let msg = err.message || '';

      // Переклад поля
      if (fieldNames[field]) {
        field = fieldNames[field];
      }

      if (
        msg.includes('must be equal to constant') ||
        msg.includes('must match "then" schema') ||
        msg.includes('must be equal to password')
      ) {
        return 'Підтвердження пароля: паролі не співпадають';
      }

      // переклад помилок на українську
      if (msg.includes('must match format "email"')) {
        msg = 'некоректний формат';
      } else if (msg.includes('must NOT have fewer than')) {
        const num = msg.match(/\d+/)?.[0] || '';
        msg = `мінімум ${num} символів`;
      } else if (msg.includes('should have required property')) {
        msg = 'обов’язкове поле';
      } else if (msg.includes('must match pattern')) {
        msg = 'тільки літери, цифри та _';
      }

      const finalMsg = field ? `${field}: ${msg}` : msg;
      return finalMsg;
    })
    .filter(msg => {
      if (seen.has(msg)) return false;
      seen.add(msg);
      return true;
    });

  return result.join('; ') || 'Невідома помилка валідації';
};

const validateLoginBody = (req, res, next) => {
  if (!validateLogin(req.body)) {
    return res.status(400).json({
      success: false,
      message: formatErrors(validateLogin.errors),
    });
  }
  next();
};

const validateRegisterBody = (req, res, next) => {
  if (!validateRegister(req.body)) {
    return res.status(400).json({
      success: false,
      message: formatErrors(validateRegister.errors),
    });
  }
  next();
};

export { validateLoginBody, validateRegisterBody };