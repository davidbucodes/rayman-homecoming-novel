import { generateId } from "../../chapterEditor/uiElements/elementId";
import { Timeout } from "../device/timeout";
import { GameEvent, GameEvents } from "./gameEvents";

export type VoiceEvent = {
	gameEvent: GameEvent.StopLipMove | GameEvent.StartLipMove | GameEvent.VoiceRead;
	millisecondsFromStart: number;
};

export class VoiceEvents {
	private static _timeouts: Timeout[];

	static setVoiceEventTimeouts(voiceEvents: VoiceEvent[]) {
		this.clearAllTimeouts();
		this._timeouts = voiceEvents.map(({ gameEvent, millisecondsFromStart }) => {
			return new Timeout(() => {
				GameEvents.emitEvent(gameEvent, { millisecondsFromStart });
			}, millisecondsFromStart);
		});
	}

	static clearAllTimeouts() {
		this._timeouts?.forEach((timeout) => timeout.clear());
		this._timeouts = [];
	}
}
