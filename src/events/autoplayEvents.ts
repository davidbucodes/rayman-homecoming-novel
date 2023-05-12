import { Timeout } from "../device/timeout";
import { GameEvent, GameEvents } from "./gameEvents";

export class AutoplayEvents {
	private static _timeout: Timeout;

	static setTimeout(millisecondsFromStart: number = 150) {
		this.clearTimeout();
		this._timeout = new Timeout(() => {
			GameEvents.emitEvent(GameEvent.Continue, { millisecondsFromStart });
		}, millisecondsFromStart);
	}

	static clearTimeout() {
		this._timeout?.clear();
		this._timeout = null;
	}
}
