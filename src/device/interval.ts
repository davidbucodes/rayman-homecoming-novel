export class Interval {
	private _interval: NodeJS.Timer = null;

	constructor(callback: (...args: unknown[]) => unknown, timeInMilliseconds: number) {
		this._interval = setInterval(callback, timeInMilliseconds);
	}

	clear() {
		clearInterval(this._interval);
	}
}
