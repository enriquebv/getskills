export default class SSRError {
  public message = "Uknown SSR Error";

  constructor(public status: number, message?: string) {
    if (message) this.message = message;
  }

  toJSON() {
    const { message, status } = this;
    return { status, message };
  }
}
