type EventType = string;
type EventData = unknown;

type EventCallback<T = EventData> = (data?: T) => Promise<unknown>;
export type CallbackId = string;

export class Events {
	private static callbackIdToEvent: Record<string, EventType> = {};

	protected static callbacks: Record<EventType, Record<string, EventCallback<EventData>>> = {};

	static removeAllCallbacks() {
		this.callbacks = {};
		this.callbackIdToEvent = {};
	}

	static removeCallback(callbackId: CallbackId) {
		const eventType = this.callbackIdToEvent[callbackId];
		delete this.callbacks[eventType][callbackId];
		delete this.callbackIdToEvent[callbackId];
	}

	static registerCallback(eventType: EventType, callback: EventCallback): CallbackId {
		const callbackId = this.generateCallbackId();
		this.callbacks[eventType] ||= {};
		this.callbacks[eventType][callbackId] = callback;
		this.callbackIdToEvent[callbackId] = eventType;
		return callbackId;
	}

	static emitEvent(eventType: EventType, data?: EventData): void {
		const callbacks = Object.values(this.callbacks[eventType] || {});
		callbacks.forEach((callback) => callback(data));
	}

	protected static generateCallbackId() {
		return Math.floor(Math.random() * 10000000).toString(36);
	}
}
