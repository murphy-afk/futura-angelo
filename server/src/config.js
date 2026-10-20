import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(here, '..', '.env');

// Load server/.env regardless of the working directory of the process.
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath, override: false });
}

function read(name, fallback) {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

// Trusting proxy headers lets the API see the real client IP, which the rate
// limiter needs. It also lets a client forge X-Forwarded-For, so it stays off
// unless a reverse proxy the operator controls sits in front of the app.
function parseTrustProxy(raw) {
  const value = String(raw).trim().toLowerCase();
  if (value === '' || value === 'false' || value === '0') return false;
  if (value === 'true' || value === '1') return true;
  if (/^\d+$/.test(value)) return Number(value);
  return value;
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(read('SERVER_PORT', '4000')),
  clientOrigin: read('CLIENT_ORIGIN', 'http://localhost:5173'),
  publicUrl: read('PUBLIC_URL', 'http://localhost:5173'),
  trustProxy: parseTrustProxy(read('TRUST_PROXY', 'false')),
  clientDist: path.resolve(here, '..', '..', 'client', 'dist'),
  ssrEntry: path.resolve(here, '..', '..', 'client', 'dist-ssr', 'entry-server.js'),
  db: {
    host: read('DB_HOST', 'localhost'),
    port: Number(read('DB_PORT', '3306')),
    user: read('DB_USER', 'root'),
    password: read('DB_PASSWORD', ''),
    database: read('DB_NAME', 'futura'),
  },
};
