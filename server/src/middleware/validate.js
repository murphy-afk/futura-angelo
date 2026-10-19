import { badRequest } from '../lib/errors.js';

// Schema driven validation for request bodies, query strings and path params.
// A rule looks like:
//
//   { kind: 'string', required: true, min: 2, max: 160 }
//   { kind: 'slug', required: true, max: 120 }
//   { kind: 'email', required: true, max: 190 }
//   { kind: 'enum', values: ['privato', 'rivenditore'], default: 'privato' }
//
// Unknown fields are ignored, so extra keys from a client or a bot never
// reach the database. Error messages stay English, per the language rules.

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function readValue(source, field) {
  const value = source[field];
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
}

function runRule(field, rule, source) {
  const raw = readValue(source, field);

  if (raw === undefined) {
    if (rule.default !== undefined) return rule.default;
    if (rule.required) throw badRequest(`Missing required field: ${field}`);
    return undefined;
  }

  if (typeof raw !== 'string') throw badRequest(`Invalid field: ${field}`);

  const value = raw.trim();

  if (rule.kind === 'email') {
    const max = rule.max ?? 190;
    if (!EMAIL_PATTERN.test(value) || value.length > max) {
      throw badRequest(`Invalid field: ${field}`);
    }
    return value;
  }

  if (rule.kind === 'slug') {
    const max = rule.max ?? 120;
    if (value.length > max || !SLUG_PATTERN.test(value)) {
      throw badRequest(`Invalid field: ${field}`);
    }
    return value;
  }

  if (rule.kind === 'enum') {
    if (!rule.values.includes(value)) throw badRequest(`Invalid field: ${field}`);
    return value;
  }

  const min = rule.min ?? 0;
  const max = rule.max ?? 255;
  if (value.length < min || value.length > max) {
    throw badRequest(`Invalid field: ${field}`);
  }
  if (rule.pattern && !rule.pattern.test(value)) {
    throw badRequest(`Invalid field: ${field}`);
  }
  return value;
}

function runSchema(schema, source) {
  const result = {};
  for (const [field, rule] of Object.entries(schema)) {
    const value = runRule(field, rule, source);
    if (value !== undefined) result[field] = value;
  }
  return result;
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function validateBody(schema) {
  return function validated(req, res, next) {
    try {
      req.validatedBody = runSchema(schema, isObject(req.body) ? req.body : {});
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function validateQuery(schema) {
  return function validated(req, res, next) {
    try {
      req.validatedQuery = runSchema(schema, isObject(req.query) ? req.query : {});
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function validateParams(schema) {
  return function validated(req, res, next) {
    try {
      req.validatedParams = runSchema(schema, isObject(req.params) ? req.params : {});
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
