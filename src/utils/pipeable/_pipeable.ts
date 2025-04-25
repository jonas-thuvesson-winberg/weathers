export default class Pipeable<T> {
  private constructor(private value: T) {}

  static from<T>(value: T): Pipeable<T> {
    return new Pipeable(value);
  }

  pipe<TRes>(fn: (input: T) => TRes): Pipeable<TRes> {
    const newValue = fn(this.value);
    return new Pipeable(newValue);
  }

  result(): T {
    return this.value;
  }
}
