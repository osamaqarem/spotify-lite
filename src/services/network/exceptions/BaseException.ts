export default class BaseException extends Error {
  private _status: number | string
  private _message: string
  private _url: string

  public get status(): number | string {
    return this._status
  }

  public get message(): string {
    return this._message
  }

  public get url(): string {
    return this._url
  }

  constructor(status: number | string, message: string, url: string) {
    super()

    this._status = status
    this._message = message
    this._url = url
  }

  getFormattedErrorString() {
    return `Status: ${this._status}. Message: ${this._message}. URL: ${this._url}`
  }
}
