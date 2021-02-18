export default class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserError';
  }

  static from(error) {
    const newError = new UserError(error?.message);
    newError.stack = error?.stack;
    return newError;
  }
}
