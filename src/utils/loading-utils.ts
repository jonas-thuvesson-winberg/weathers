export class LoadingUtils {
  private static _isLoading = false;

  static setLoading(loading: boolean) {
    this._isLoading = loading;
  }

  static dispatchLoading() {
    console.log("loading");
    document.dispatchEvent(
      new CustomEvent("manual:loading", {
        bubbles: true,
        cancelable: true,
      })
    );
  }

  static dispatchLoaded() {
    console.log("loaded");
    document.dispatchEvent(
      new CustomEvent("manual:loaded", {
        bubbles: true,
        cancelable: true,
      })
    );
  }

  static isLoading() {
    return this._isLoading;
  }
}
