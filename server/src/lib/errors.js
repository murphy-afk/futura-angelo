// Small HTTP error type so controllers can signal a status without writing
// response bodies by hand. The error middleware in app.js reads `status` and
// `expose` and decides what the client sees.

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.expose = true;
  }
}

export function badRequest(message = 'Invalid request') {
  return new HttpError(400, message);
}

export function notFound(message = 'Resource not found') {
  return new HttpError(404, message);
}
