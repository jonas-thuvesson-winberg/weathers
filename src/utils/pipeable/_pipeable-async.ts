export default class PipeableAsync<T> {
  private constructor(private value: Promise<T>) {}

  static from<T>(value: T | Promise<T>): PipeableAsync<T> {
    return new PipeableAsync(Promise.resolve(value));
  }

  pipe<TRes>(fn: (input: T) => TRes | Promise<TRes>): PipeableAsync<TRes> {
    const newValue = this.value.then(fn);
    return new PipeableAsync(newValue);
  }

  async result(): Promise<T> {
    return this.value;
  }
}