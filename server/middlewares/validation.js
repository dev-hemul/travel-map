import { validateLogin, validateRegister } from './../validation/authSchemas.js';

const formatErrors = (errors) => {
  return errors
    .map(err => {
      let field = err.instancePath.slice(1) || err.params.missingProperty || '';
      let msg = err.message;

      return field ? `${field} ${msg}` : msg;
    })
    .join('; ');
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