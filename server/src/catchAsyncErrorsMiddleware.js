/**
 * middleware wraps async function / promise of request handler
 * and passes thrown error / rejection to "next" in order to catch all errors in default error handler.
 *
 * @param fn
 * @return {Function}
 */
const catchAsyncErrorsMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsyncErrorsMiddleware;
