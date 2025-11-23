import { validateLogin, validateRegister } from './../validation/authSchemas.js';

const formatErrors = (errors) => {
  const fieldNames = {
    email: 'електронну пошту',
    password: 'пароль',
    username: "імʼя користувача",
    confirmPassword: 'підтвердження пароля',
  };

  const seen = new Set();

  const result = errors
    .map(err => {
      const field =
        err.instancePath.slice(1) ||
        err.params?.missingProperty ||
        '';

      const msg = err.message || '';

      // паролі не співпадають 
      if (
        msg.includes('must be equal to constant') ||
        msg.includes('must match "then" schema') ||
        msg.includes('must be equal to password')
      ) {
        return 'Паролі не співпадають';
      }

      // імейл
      if (field === 'email') {
        if (msg.includes('must match format "email"')) {
          return 'Некоректний формат електронної пошти';
        }
        if (msg.includes('should have required property')) {
          return 'Електронна пошта є обовʼязковою';
        }
      }

      // недостатньо символів
      if (field === 'password') {
        if (msg.includes('must NOT have fewer than')) {
          const num = msg.match(/\d+/)?.[0] || '';
          return `Пароль має містити щонайменше ${num} символів`;
        }
        if (msg.includes('should have required property')) {
          return 'Пароль є обовʼязковим';
        }
      }

      // юзернейм
      if (field === 'username') {
        if (msg.includes('must match pattern')) {
          return "Імʼя користувача може містити лише літери, цифри та _";
        }
        if (msg.includes('should have required property')) {
          return "Імʼя користувача є обовʼязковим";
        }
      }

      // поле є обов'язковим
      if (msg.includes('should have required property')) {
        const fieldName = fieldNames[field] || 'це поле';
        return `Поле ${fieldName} є обовʼязковим`;
      }

      return msg;
    })
    .filter(message => {
      if (seen.has(message)) return false;
      seen.add(message);
      return true;
    });

  return result.join('. ') || 'Невідома помилка валідації';
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