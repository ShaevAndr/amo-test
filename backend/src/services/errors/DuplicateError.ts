export class DuplicateError extends Error {
  public readonly status = 409;
  constructor(message = 'Duplicate') {
    super(message);
    this.name = 'DuplicateError';
  }
}
