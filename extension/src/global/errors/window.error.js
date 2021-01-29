/**
 * Any error regarding the extension window
 */
export default class WindowError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WindowError';
  }

  static from(error) {
    const newError = new WindowError(error.message);
    newError.stack = error?.stack;
    return newError;
  }
}
