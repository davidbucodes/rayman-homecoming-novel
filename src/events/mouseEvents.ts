import * as PIXI from "pixi.js";

const POINTER_UP_EVENT = "pointerup";

export class MouseEvents {
	private static _callbackByContainerTuples: Array<[PIXI.Container, () => unknown]> = [];

	static registerPointerUpEvent(container: PIXI.Container, callback: () => unknown) {
		this._callbackByContainerTuples.push([container, callback]);
		container.on(POINTER_UP_EVENT, callback);
	}

	static removeAllEvents() {
		this._callbackByContainerTuples.forEach(([container, callback]) => {
			container.off(POINTER_UP_EVENT, callback);
		});
	}
}
