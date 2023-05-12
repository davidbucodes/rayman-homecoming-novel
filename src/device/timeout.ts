export class Timeout {
	private _timeout: ReturnType<typeof setTimeout> = null;

	constructor(callback: (...args: unknown[]) => unknown, timeInMilliseconds: number) {
		this._timeout = setTimeout(callback, timeInMilliseconds);
	}

	clear() {
		clearTimeout(this._timeout);
	}
}
