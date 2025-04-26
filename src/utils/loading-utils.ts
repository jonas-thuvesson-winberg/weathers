export class LoadingUtils {
  private static _isLoading = false;

  static setLoading(loading: boolean) {
    this._isLoading = loading;
  }

  static isLoading() {
    return this._isLoading;
  }
}
