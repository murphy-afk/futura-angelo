// Express 4 does not forward rejected promises to the error middleware.
// Every async controller is wrapped so a thrown HttpError becomes a JSON
// error response instead of an unhandled rejection.

export function asyncHandler(handler) {
  return function wrapped(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
