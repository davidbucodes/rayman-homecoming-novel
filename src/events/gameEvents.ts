import { ConfigOptions } from "../config/config";
import { CallbackId, Events } from "./events";

// eslint-disable-next-line
type EventData = any;
type ConfigUpdatedEventData = { previousConfig: ConfigOptions };
type VoiceReadEventData = { elapsedSpeakTime: number };
type VoiceEventData = { millisecondsFromStart: number };
type EventCallback<T = EventData> = (data?: T) => Promise<unknown>;

export enum GameEvent {
	Continue = "Continue",
	StartLipMove = "StartLipMove",
	StopLipMove = "StopLipMove",
	VoiceRead = "VoiceRead",
	OpenMenuPopup = "OpenMenuPopup",
	MenuClosed = "MenuClosed",
}

export class GameEvents extends Events {
	static registerCallback(
		eventType: GameEvent.VoiceRead,
		callback: EventCallback<VoiceReadEventData>,
	): CallbackId;
	static registerCallback(
		eventType: GameEvent.StartLipMove,
		callback: EventCallback<VoiceEventData>,
	): CallbackId;
	static registerCallback(
		eventType: GameEvent.StopLipMove,
		callback: EventCallback<VoiceEventData>,
	): CallbackId;
	static registerCallback(eventType: GameEvent, callback: EventCallback): CallbackId;
	static registerCallback(eventType: GameEvent, callback: EventCallback): CallbackId {
		return super.registerCallback(eventType, callback);
	}

	static emitEvent(eventType: GameEvent.VoiceRead, data: VoiceReadEventData): void;
	static emitEvent(eventType: GameEvent.StartLipMove, data: VoiceEventData): void;
	static emitEvent(eventType: GameEvent.StopLipMove, data: VoiceEventData): void;
	static emitEvent(eventType: GameEvent, data?: EventData): void;
	static emitEvent(eventType: GameEvent, data?: EventData): void {
		return super.emitEvent(eventType, data);
	}
}
