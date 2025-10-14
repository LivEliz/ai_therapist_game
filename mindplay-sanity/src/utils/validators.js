// src/utils/validators.js
function validateString(val, name) {
  if (typeof val !== 'string' || val.trim() === '') return `${name} must be a non-empty string.`;
  if (val.length > 1000) return `${name} too long.`;
  return null;
}

function validateBoolean(val, name) {
  if (typeof val !== 'boolean') return `${name} must be boolean.`;
  return null;
}

module.exports = { validateString, validateBoolean };
