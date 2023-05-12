import { ConfigOptions } from "../config/config";
import { CallbackId, Events } from "./events";

type ConfigUpdatedEventData = { previousConfig: ConfigOptions };
type EventCallback<T = ConfigUpdatedEventData> = (data?: T) => Promise<unknown>;

export enum ConfigEvent {
	ConfigUpdated = "ConfigUpdated",
}

export class ConfigEvents extends Events {
	static registerCallback(
		eventType: ConfigEvent.ConfigUpdated,
		callback: EventCallback<ConfigUpdatedEventData>,
	): CallbackId {
		return super.registerCallback(eventType, callback);
	}

	static emitEvent(eventType: ConfigEvent.ConfigUpdated, data: ConfigUpdatedEventData): void {
		return super.emitEvent(eventType, data);
	}
}
