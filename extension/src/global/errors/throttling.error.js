export default class ThrottlingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ThrottlingError';
  }

  static from(error) {
    const newError = new ThrottlingError(error.message);
    newError.stack = error?.stack;
    return newError;
  }
}
