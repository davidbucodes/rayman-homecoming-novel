import { Dimensions } from "../views/graphicElement/dimensions";

export class Device {
	static readonly isTouchDevice = "ontouchstart" in window;
	private static _screenDimensions: Dimensions;

	static get screenDimensions(): Dimensions {
		if (!this._screenDimensions) {
			this._screenDimensions = {
				x: 0,
				y: 0,
				height: screen.height,
				width: screen.width,
			};
		}
		return this._screenDimensions;
	}

	static get isFullscreenOpened() {
		return matchMedia("(display-mode: fullscreen)").matches;
	}

	static openFullscreen() {
		if (this.isFullscreenOpened) {
			return;
		}

		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if ("webkitRequestFullscreen" in document.documentElement) {
			(
				document.documentElement as unknown as { webkitRequestFullscreen: () => unknown }
			).webkitRequestFullscreen();
		} else if ("msRequestFullscreen" in document.documentElement) {
			(
				document.documentElement as unknown as { msRequestFullscreen: () => unknown }
			).msRequestFullscreen();
		}
	}

	static getScreenRelativeHeight(multiplyBy: number) {
		return this.screenDimensions.height * multiplyBy;
	}

	static getScreenRelativeWidth(multiplyBy: number) {
		return this.screenDimensions.width * multiplyBy;
	}
}
