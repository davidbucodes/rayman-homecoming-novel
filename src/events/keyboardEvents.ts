import { CallbackId, Events } from "./events";

export enum KeyboardKeyId {
	Space = "Space",
	M = "M",
	A = "A",
	J = "J",
	E = "E",
	H = "H",
	Up = "ArrowUp",
	Down = "ArrowDown",
	Right = "ArrowRight",
	Left = "ArrowLeft",
}

type EventCallback = (keyboardKey: KeyboardKeyId) => Promise<void>;

export class KeyboardEvents extends Events {
	private static isInitialized = false;
	private static currentKeysDown: { [keyCode in KeyboardKeyId]?: boolean } = {};

	static registerCallback(
		keyboardKeyToListen: KeyboardKeyId,
		callback: EventCallback,
	): CallbackId {
		if (!this.isInitialized) {
			this.init();
		}
		return super.registerCallback(keyboardKeyToListen, callback);
	}

	private static init() {
		window.addEventListener("keydown", (ev: KeyboardEvent) => {
			const keyboardKey = ev.code as KeyboardKeyId;

			if (this.currentKeysDown[keyboardKey]) {
				return;
			}

			this.currentKeysDown[keyboardKey] = true;

			if (Object.values(KeyboardKeyId).includes(keyboardKey)) {
				const callbacksForKey = this.callbacks[keyboardKey] || {};
				Object.values(callbacksForKey).forEach((callback: EventCallback) =>
					callback(keyboardKey),
				);
			}
		});

		window.addEventListener("keyup", (ev: KeyboardEvent) => {
			const keyboardKey = ev.code as KeyboardKeyId;
			this.currentKeysDown[keyboardKey] = false;
		});

		this.isInitialized = true;
	}
}
