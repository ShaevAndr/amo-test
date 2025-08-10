export class AmoError extends Error {
  public readonly status = 502;
  constructor(
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AmoError';
    console.error(originalError);
  }
}
