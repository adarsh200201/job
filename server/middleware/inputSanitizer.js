const xss = require('xss');

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'string') {
        obj[key] = xss(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
  }
  return obj;
}

function inputSanitizer(req, res, next) {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
}

module.exports = inputSanitizer;
