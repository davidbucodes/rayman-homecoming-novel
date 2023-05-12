import { Application, TickerCallback } from "pixi.js";
import { App } from "../app/app";

export type AnimationCallback = TickerCallback<Application>;
export type AnimationOptions = { callback: AnimationCallback };

export class Animation {
	private static _callbacks: AnimationCallback[] = [];

	constructor(private options: AnimationOptions) {}

	play() {
		App.ticker.add(this.options.callback);
		Animation._callbacks = Animation._callbacks.filter(
			(callback) => callback !== this.options.callback,
		);
		Animation._callbacks.push(this.options.callback);
	}

	stop() {
		App.ticker.remove(this.options.callback);
		Animation._callbacks = Animation._callbacks.filter(
			(callback) => callback !== this.options.callback,
		);
	}

	static removeAll() {
		this._callbacks.forEach((callback) => {
			App.ticker.remove(callback);
		});
		this._callbacks = [];
	}

	static stopAll() {
		this._callbacks.forEach((callback) => {
			App.ticker.remove(callback);
		});
	}

	static resumeAll() {
		this._callbacks.forEach((callback) => {
			App.ticker.remove(callback);
		});
		this._callbacks.forEach((callback) => {
			App.ticker.add(callback);
		});
	}
}
